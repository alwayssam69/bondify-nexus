
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import VideoCall from "@/components/chat/VideoCall";
import ChatContacts from "@/components/chat/ChatContacts";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import IncomingCall from "@/components/chat/IncomingCall";
import EmptyChat from "@/components/chat/EmptyChat";
import { ChatMessage, ChatContact } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { fetchChatContacts, fetchChatMessages, sendMessage } from "@/services/DataService";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{contactId: string, contactName: string} | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Load chat contacts
    const loadContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const contactsData = await fetchChatContacts(user.id);
        setContacts(contactsData);
        
        // Auto-select first contact if none selected yet
        if (contactsData.length > 0 && !activeContact) {
          setActiveContact(contactsData[0].id);
        }
      } catch (error) {
        console.error("Error loading chat contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setIsLoadingContacts(false);
      }
    };
    
    loadContacts();
    
    // Set up realtime subscription for new messages
    const messagesChannel = supabase
      .channel('db-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          // Check if this is a new message for the active conversation
          if (payload.new && activeContact === payload.new.sender_id) {
            const newMessage: ChatMessage = {
              id: payload.new.id,
              sender: 'match',
              text: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            setMessages(prev => [...prev, newMessage]);
          } else if (payload.new) {
            // Update contact unread count
            setContacts(prev => 
              prev.map(contact => 
                contact.id === payload.new.sender_id 
                  ? { ...contact, unread: contact.unread + 1, lastMessage: payload.new.content }
                  : contact
              )
            );
            
            // Show a toast notification for new message
            const sender = contacts.find(c => c.id === payload.new.sender_id);
            if (sender) {
              toast.info(`New message from ${sender.name}`, {
                action: {
                  label: "View",
                  onClick: () => setActiveContact(sender.id)
                }
              });
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user, navigate, activeContact]);
  
  // Load messages when active contact changes
  useEffect(() => {
    if (!user || !activeContact) return;
    
    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const messagesData = await fetchChatMessages(user.id, activeContact);
        setMessages(messagesData);
        
        // Mark messages as read
        if (messagesData.length > 0) {
          // Update UI immediately
          setContacts(prev => 
            prev.map(contact => 
              contact.id === activeContact 
                ? { ...contact, unread: 0 }
                : contact
            )
          );
          
          // Update in database (would be done in a real implementation)
          // This would require an additional API endpoint
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };
    
    loadMessages();
  }, [user, activeContact]);
  
  const handleSendMessage = async (messageText: string) => {
    if (!user || !activeContact) return;
    
    // Optimistically add message to UI
    const tempId = `temp-${Date.now()}`;
    const newMessage: ChatMessage = {
      id: tempId,
      sender: "user",
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send to database
    try {
      const savedMessage = await sendMessage(user.id, activeContact, messageText);
      if (savedMessage) {
        // Replace temp message with saved one
        setMessages(prev => 
          prev.map(msg => msg.id === tempId ? savedMessage : msg)
        );
        
        // Update contact's last message
        setContacts(prev => 
          prev.map(contact => 
            contact.id === activeContact 
              ? { ...contact, lastMessage: messageText }
              : contact
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  // Handle video call
  const initiateVideoCall = () => {
    if (!activeContact) return;

    const contact = contacts.find(c => c.id === activeContact);
    if (!contact) return;

    if (!contact.online) {
      toast.info(`${contact.name} is currently offline. Try again later.`);
      return;
    }

    setIsInVideoCall(true);
    toast.success(`Starting video call with ${contact.name}`);
  };

  // Simulate receiving call (for demo purposes)
  const simulateIncomingCall = () => {
    // Only simulate if the user isn't already in a call
    if (isInVideoCall || incomingCall) return;

    // Choose a random online contact
    const onlineContacts = contacts.filter(c => c.online && c.id !== activeContact);
    if (onlineContacts.length === 0) return;

    const randomContact = onlineContacts[Math.floor(Math.random() * onlineContacts.length)];
    setIncomingCall({
      contactId: randomContact.id,
      contactName: randomContact.name
    });

    // Auto-decline after 15 seconds if not answered
    setTimeout(() => {
      setIncomingCall(null);
    }, 15000);
  };

  // Just for demo - simulate incoming call chance when user visits the page
  useEffect(() => {
    const timer = setTimeout(() => {
      // 30% chance of getting a call for demo purposes
      if (Math.random() < 0.3) {
        simulateIncomingCall();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);
  
  const activeContactData = contacts.find(contact => contact.id === activeContact);
  
  if (!user) {
    return (
      <Layout className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your messages</h2>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout className="pt-28 pb-16 px-6">
      {isInVideoCall && activeContactData && (
        <VideoCall 
          contactId={activeContactData.id}
          contactName={activeContactData.name}
          onEndCall={() => setIsInVideoCall(false)}
        />
      )}

      {incomingCall && (
        <IncomingCall 
          contact={incomingCall}
          onAccept={() => {
            setActiveContact(incomingCall.contactId);
            setIncomingCall(null);
            setIsInVideoCall(true);
          }}
          onDecline={() => setIncomingCall(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="card-glass rounded-xl grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Contacts sidebar */}
          <ChatContacts 
            contacts={contacts}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
            isLoading={isLoadingContacts}
          />
          
          {/* Chat area */}
          <div className="col-span-2 flex flex-col h-full">
            {activeContactData ? (
              <>
                {/* Chat header */}
                <ChatHeader 
                  contact={activeContactData}
                  onInitiateVideoCall={initiateVideoCall}
                />
                
                {/* Messages */}
                <MessageList 
                  messages={messages}
                  isLoading={isLoadingMessages} 
                />
                
                {/* Message input */}
                <MessageInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <EmptyChat />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
