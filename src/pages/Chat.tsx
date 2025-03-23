import React, { useState, useEffect } from "react";
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

const Chat = () => {
  const { user } = useAuth();
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchContactsData = async () => {
      if (!user?.id) return;
      
      setIsLoadingContacts(true);
      try {
        const contactsData = await fetchChatContacts(user.id);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Could not load contacts");
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
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Could not load messages");
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
        setContacts(updatedContacts);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const activeContact = contacts.find((contact) => contact.id === activeContactId);

  return (
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
  );
};

export default Chat;
