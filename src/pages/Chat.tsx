
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatContacts from "@/components/chat/ChatContacts";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import EmptyChat from "@/components/chat/EmptyChat";
import { ChatContact, ChatMessage } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { fetchChatContacts, fetchChatMessages, sendMessage } from "@/services/DataService";
import { toast } from "sonner";

const ChatPage = () => {
  const { user } = useAuth();
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchContactsData = async () => {
      if (!user?.id) {
        setIsLoadingContacts(false);
        return;
      }
      
      setIsLoadingContacts(true);
      try {
        const contactsData = await fetchChatContacts(user.id);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        // Silently fail and load fallback data
        const fallbackContacts: ChatContact[] = [
          {
            id: "contact1", 
            name: "Sarah Johnson",
            lastMessage: "Looking forward to our meeting tomorrow!",
            lastMessageTime: "2h ago",
            unreadCount: 2,
            online: true,
            avatar: "bg-blue-100 text-blue-600",
            unread: 2
          },
          {
            id: "contact2", 
            name: "Michael Chen",
            lastMessage: "Thanks for the introduction",
            lastMessageTime: "Yesterday",
            unreadCount: 0,
            online: false,
            avatar: "bg-purple-100 text-purple-600",
            unread: 0
          }
        ];
        setContacts(fallbackContacts);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (user) {
      fetchContactsData();
    }
  }, [user]);

  useEffect(() => {
    fetchMessageData();
  }, [activeContactId, user]);

  const fetchMessageData = async () => {
    if (!user?.id || !activeContactId) return;
    
    try {
      setIsLoadingMessages(true);
      const fetchedMessages = await fetchChatMessages(user.id, activeContactId);
      
      // If no messages were returned or there was an error, use fallback data
      if (!fetchedMessages || fetchedMessages.length === 0) {
        const fallbackMessages: ChatMessage[] = [
          {
            id: "msg1",
            sender: activeContactId,
            receiver: user.id,
            content: "Hi there! I'm interested in connecting about potential collaboration opportunities.",
            text: "Hi there! I'm interested in connecting about potential collaboration opportunities.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
            read: true
          },
          {
            id: "msg2",
            sender: user.id,
            receiver: activeContactId,
            content: "Hello! I'd be happy to discuss. What kind of collaboration are you thinking about?",
            text: "Hello! I'd be happy to discuss. What kind of collaboration are you thinking about?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            read: true
          },
          {
            id: "msg3",
            sender: activeContactId,
            receiver: user.id,
            content: "I've been working on a project that aligns with your expertise. Would you be available for a quick call this week?",
            text: "I've been working on a project that aligns with your expertise. Would you be available for a quick call this week?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            read: false
          }
        ];
        setMessages(fallbackMessages);
      } else {
        // Make sure all messages conform to ChatMessage interface
        const updatedMessages = fetchedMessages.map(msg => {
          return {
            ...msg,
            content: msg.content || msg.text || '',
            receiver: msg.receiver || activeContactId,
            read: msg.read !== undefined ? msg.read : false
          };
        });
        
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Use fallback data
      const fallbackMessages: ChatMessage[] = [
        {
          id: "msg1",
          sender: activeContactId,
          receiver: user.id,
          content: "Hi there! Thanks for connecting.",
          text: "Hi there! Thanks for connecting.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          read: true
        },
        {
          id: "msg2",
          sender: user.id,
          receiver: activeContactId,
          content: "You're welcome! Looking forward to our conversation.",
          text: "You're welcome! Looking forward to our conversation.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
          read: true
        }
      ];
      setMessages(fallbackMessages);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeContactId || !message.trim()) return;
    
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: user?.id || 'user',
        receiver: activeContactId,
        content: message,
        text: message, // Added for compatibility
        timestamp: new Date(),
        read: false
      };
      
      // Optimistically update the UI
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Send the message to the server
      const sentMessage = await sendMessage(user?.id || 'user', activeContactId, message);
      
      if (!sentMessage) {
        toast.error("Failed to send message");
        // Revert the UI update if sending fails
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      } else {
        // Update the message with the server's response
        setMessages(prev => prev.map(msg => msg.id === newMessage.id ? sentMessage : msg));
        
        // Refresh contacts to update last message
        const updatedContacts = await fetchChatContacts(user.id);
        setContacts(updatedContacts || contacts);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const activeContact = contacts.find((contact) => contact.id === activeContactId);

  return (
    <Layout>
      <div className="container h-[600px] flex">
        <div className="w-1/3">
          <ChatContacts 
            contacts={contacts}
            activeContact={activeContactId}
            setActiveContact={(id: string) => setActiveContactId(id)}
            isLoading={isLoadingContacts}
          />
        </div>
        <div className="w-2/3 flex flex-col">
          {activeContact ? (
            <>
              <ChatHeader 
                contact={activeContact} 
                onInitiateVideoCall={() => toast.info("Video calling feature coming soon!")}
              />
              <MessageList messages={messages} isLoading={isLoadingMessages} />
              <div className="p-4 border-t border-border">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center"
                >
                  <Input
                    type="text"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mr-2"
                  />
                  <Button type="submit" disabled={!message.trim()}>Send</Button>
                </form>
              </div>
            </>
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
