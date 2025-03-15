
import React, { useState, useEffect } from "react";
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

const Chat = () => {
  const [activeContact, setActiveContact] = useState<string | null>("1");
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{contactId: string, contactName: string} | null>(null);
  
  // Sample contacts data
  const contacts: ChatContact[] = [
    {
      id: "1",
      name: "Alex Johnson",
      lastMessage: "Hey, how are you doing today?",
      avatar: "bg-blue-100",
      unread: 2,
      online: true
    },
    {
      id: "2",
      name: "Taylor Moore",
      lastMessage: "I saw you like hiking too! Which trails do you recommend?",
      avatar: "bg-purple-100",
      unread: 0,
      online: false,
      lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: "3",
      name: "Jamie Chen",
      lastMessage: "Thanks for accepting my connection!",
      avatar: "bg-green-100",
      unread: 1,
      online: true
    },
    {
      id: "4",
      name: "Morgan Smith",
      lastMessage: "Would you like to meet up for coffee sometime?",
      avatar: "bg-yellow-100",
      unread: 0,
      online: false,
      lastSeen: new Date(Date.now() - 86400000) // 1 day ago
    }
  ];
  
  // Sample messages for the first contact
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "match",
      text: "Hey there! I noticed we have a lot in common.",
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: "2",
      sender: "user",
      text: "Hi! Yes, I noticed that too. I love your profile!",
      timestamp: new Date(Date.now() - 82800000)
    },
    {
      id: "3",
      sender: "match",
      text: "Thanks! I see you're into photography. What kind of photos do you like to take?",
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: "4",
      sender: "user",
      text: "I mostly do landscape and street photography. I love capturing moments that tell a story.",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "5",
      sender: "match",
      text: "That sounds amazing! I'd love to see some of your work sometime.",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: "6",
      sender: "match",
      text: "Hey, how are you doing today?",
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  
  const sendMessage = (messageText: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate a response after 1 second
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "match",
        text: "That's interesting! Tell me more.",
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
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
                <MessageList messages={messages} />
                
                {/* Message input */}
                <MessageInput onSendMessage={sendMessage} />
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
