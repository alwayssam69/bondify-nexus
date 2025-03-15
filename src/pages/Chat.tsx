
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import VideoCall from "@/components/chat/VideoCall";

interface ChatMessage {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: Date;
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unread: number;
  online: boolean;
  lastSeen?: Date;
}

const Chat = () => {
  const [activeContact, setActiveContact] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");
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
  
  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageInput,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
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
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // 30% chance of getting a call for demo purposes
      if (Math.random() < 0.3) {
        simulateIncomingCall();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatLastSeen = (date?: Date) => {
    if (!date) return "";
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Last seen recently";
    } else if (diffInHours < 24) {
      return `Last seen ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Last seen ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };
  
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
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4 animate-pulse">
              <span className="text-3xl">{incomingCall.contactName[0]}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Incoming Video Call</h3>
            <p className="mb-6">{incomingCall.contactName} is calling you</p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="destructive" 
                className="rounded-full px-6"
                onClick={() => {
                  toast.info(`Call from ${incomingCall.contactName} declined`);
                  setIncomingCall(null);
                }}
              >
                Decline
              </Button>
              <Button 
                variant="default" 
                className="rounded-full px-6 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setActiveContact(incomingCall.contactId);
                  setIncomingCall(null);
                  setIsInVideoCall(true);
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="card-glass rounded-xl grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Contacts sidebar */}
          <div className="border-r border-border">
            <div className="p-4">
              <Input 
                placeholder="Search conversations..." 
                className="mb-4"
              />
            </div>
            
            <ScrollArea className="h-[540px]">
              {contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`p-4 border-b border-border last:border-0 cursor-pointer hover:bg-secondary/50 ${activeContact === contact.id ? 'bg-secondary' : ''}`}
                  onClick={() => setActiveContact(contact.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full ${contact.avatar} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg font-light">{contact.name[0]}</span>
                      </div>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.unread > 0 && (
                          <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          
          {/* Chat area */}
          <div className="col-span-2 flex flex-col h-full">
            {activeContactData ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${activeContactData.avatar} flex items-center justify-center`}>
                      <span className="text-base font-light">{activeContactData.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{activeContactData.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activeContactData.online ? (
                          <span className="text-green-500">Online now</span>
                        ) : (
                          formatLastSeen(activeContactData.lastSeen)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Voice Call"
                      onClick={() => toast.info("Voice calling feature coming soon!")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </Button>
                    <Button 
                      variant={activeContactData.online ? "ghost" : "outline"} 
                      size="icon" 
                      title="Video Call"
                      onClick={initiateVideoCall}
                      disabled={!activeContactData.online}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" title="More Options">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'} text-right mt-1`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Message input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </Button>
                    <Input 
                      placeholder="Type a message..." 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Conversation Selected</h3>
                  <p className="text-muted-foreground">Select a conversation from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
