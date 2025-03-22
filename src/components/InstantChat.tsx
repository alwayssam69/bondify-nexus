
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/lib/matchmaking';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface InstantChatProps {
  currentUser: UserProfile;
  connections?: UserProfile[];
}

const InstantChat: React.FC<InstantChatProps> = ({ currentUser, connections = [] }) => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Use connections from props, or populate with sample data if not provided
  const availableChats = connections.length > 0 
    ? connections 
    : [
        { id: "chat1", name: "Alex J.", matchScore: 92, avatar: "", location: "San Francisco", isNew: true },
        { id: "chat2", name: "Taylor M.", matchScore: 87, avatar: "", location: "New York", isNew: false },
        { id: "chat3", name: "Jamie C.", matchScore: 89, avatar: "", location: "Chicago", isNew: true },
      ] as UserProfile[];

  // Auto select first chat if none selected
  useEffect(() => {
    if (availableChats.length > 0 && !selectedChat) {
      setSelectedChat(availableChats[0]);
    }
  }, [availableChats, selectedChat]);

  // Load chat messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    if (!user || !selectedChat) return;
    
    setIsLoading(true);
    try {
      // In a real app, fetch messages from the database
      // For now, use sample data based on selected chat
      const sampleMessages: Message[] = [
        {
          id: '1',
          sender: selectedChat.id,
          text: `Hi there! I'm ${selectedChat.name} from ${selectedChat.location}.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          isRead: true
        },
        {
          id: '2',
          sender: currentUser.id,
          text: `Nice to meet you, ${selectedChat.name}! I'd love to connect.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
          isRead: true
        },
        {
          id: '3',
          sender: selectedChat.id,
          text: `I see you're interested in ${currentUser.interests && currentUser.interests.length > 0 ? currentUser.interests[0] : 'networking'}. I'd love to discuss that more!`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isRead: true
        },
        {
          id: '4',
          sender: currentUser.id,
          text: `Absolutely! What projects are you currently working on?`,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: true
        },
        {
          id: '5',
          sender: selectedChat.id,
          text: `I'm currently working on a ${selectedChat.industry || 'technology'} project. Would love to tell you more about it when we meet!`,
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          isRead: true
        }
      ];
      
      setMessages(sampleMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user || !selectedChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.id,
      text: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // In a real app, save the message to the database
    // For now, just simulate an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate response
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: selectedChat.id,
          text: getAutoResponse(message, selectedChat),
          timestamp: new Date(),
          isRead: true
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Helper function to generate auto responses
  const getAutoResponse = (msg: string, chat: UserProfile): string => {
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
      return `Hey there! Great to connect with you!`;
    }
    
    if (lowerMsg.includes('meet') || lowerMsg.includes('coffee') || lowerMsg.includes('lunch')) {
      return `I'd love to meet up! Are you free sometime next week?`;
    }
    
    if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('job')) {
      return `I'm currently working on some exciting projects in the ${chat.industry || 'tech'} space. Would love to tell you more about it!`;
    }
    
    if (lowerMsg.includes('skill') || lowerMsg.includes('experience')) {
      return `I've been focusing on ${chat.skills && chat.skills.length > 0 ? chat.skills.slice(0, 2).join(' and ') : 'developing my skills'} recently. Always looking to learn more!`;
    }
    
    // Default responses
    const defaultResponses = [
      "That sounds interesting! Tell me more.",
      "Great point! I've been thinking about that too.",
      "I'd love to discuss this further. Maybe we could schedule a call?",
      "Thanks for sharing that! I appreciate your perspective.",
      `I see you're in ${currentUser.location}. I really like that area!`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold mb-2">Please Sign In</h3>
        <p className="text-muted-foreground mb-4">You need to be signed in to use the chat feature</p>
        <Button onClick={() => window.location.href = "/login"}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm shadow-md rounded-lg overflow-hidden border border-border/40 h-[600px] flex">
      {/* Chat list sidebar */}
      <div className="w-1/3 border-r border-border/30 bg-background/50">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-medium">Messages</h3>
        </div>
        
        <div className="overflow-y-auto h-[calc(600px-57px)]">
          {availableChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations yet. Connect with people to start chatting!
            </div>
          ) : (
            availableChats.map(chat => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedChat?.id === chat.id ? 'bg-primary/5' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mr-3">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{chat.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {/* Placeholder for last message time */}
                      2h ago
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.location} • {chat.industry || 'Professional'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Chat content */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border/30 bg-background/80 flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                {selectedChat.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.location} • {selectedChat.industry || 'Professional'}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View Profile
              </Button>
            </div>
            
            {/* Chat messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
            >
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <p className="text-muted-foreground mb-2">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      Send a message to start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender === currentUser.id;
                    const showDate = index === 0 || 
                      formatDate(messages[index-1].timestamp) !== formatDate(msg.timestamp);
                      
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                              {formatDate(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-4 py-2`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t border-border/30 bg-background/80">
              <form 
                className="flex items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!message.trim()}>
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <div>
              <h3 className="font-medium mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantChat;
