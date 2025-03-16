
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserProfile, getRandomChatMatches } from "@/lib/matchmaking";
import { MessageCircle, SkipForward, UserCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface InstantChatProps {
  currentUser: UserProfile;
}

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'partner';
  timestamp: Date;
};

const InstantChat: React.FC<InstantChatProps> = ({ currentUser }) => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  
  // Start searching for a chat partner
  const startSearching = () => {
    setIsSearching(true);
    setMessages([]);
    
    // Simulate finding a partner after a delay
    setTimeout(() => {
      const potentialPartners = getRandomChatMatches(currentUser);
      if (potentialPartners.length > 0) {
        setChatPartner(potentialPartners[0]);
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `Hi there! I'm ${isAnonymous ? 'Anonymous' : potentialPartners[0].name}. Nice to meet you!`,
          sender: 'partner',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } else {
        toast.error("No chat partners available right now. Try again later!");
        setIsSearching(false);
      }
    }, 2000);
  };
  
  // Find a new chat partner
  const findNewPartner = () => {
    setChatPartner(null);
    setMessages([]);
    startSearching();
  };
  
  // Send a message
  const sendMessage = () => {
    if (!messageInput.trim() || !chatPartner) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simulate partner response after a delay
    setTimeout(() => {
      const responseMessages = [
        "That's interesting! Tell me more.",
        "I see what you mean. I've thought about that too.",
        "Nice! I'm into similar things.",
        "I hadn't considered that perspective before.",
        "That's cool! What else are you interested in?",
        "I've had similar experiences with that.",
        "What do you think about the opposite viewpoint?",
        "I totally agree with you on that!"
      ];
      
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        text: responseMessages[Math.floor(Math.random() * responseMessages.length)],
        sender: 'partner',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };
  
  // Toggle anonymity setting
  const toggleAnonymity = () => {
    setIsAnonymous(!isAnonymous);
    
    // Notify chat partner about status change
    if (chatPartner) {
      const statusMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `[System] Your chat partner has turned ${!isAnonymous ? 'on' : 'off'} anonymity.`,
        sender: 'partner',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, statusMessage]);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-secondary/50 flex flex-row justify-between items-center">
        <CardTitle>Instant Chat</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAnonymity}
          className={isAnonymous ? "text-muted-foreground" : "text-primary"}
        >
          <UserCircle2 className="mr-2 h-4 w-4" />
          {isAnonymous ? "Anonymous" : "Visible"}
        </Button>
      </CardHeader>
      
      {!chatPartner && !isSearching ? (
        <CardContent className="p-6 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Start an Instant Chat</h3>
          <p className="text-muted-foreground mb-6">
            You'll be connected with someone random who shares your interests.
          </p>
          <Button onClick={startSearching} className="w-full">
            Find a Chat Partner
          </Button>
        </CardContent>
      ) : isSearching && !chatPartner ? (
        <CardContent className="p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-secondary mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Finding someone to chat with...</h3>
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </CardContent>
      ) : chatPartner ? (
        <>
          <CardContent className="p-0">
            <div className="flex items-center p-4 border-b">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className={chatPartner.imageUrl}>
                  {chatPartner.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">
                  {isAnonymous ? "Anonymous User" : chatPartner.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAnonymous ? "Anonymous" : `${chatPartner.age}, ${chatPartner.location}`}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                title="Find new partner"
                onClick={findNewPartner}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[300px] p-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full gap-2">
              <Input 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
};

export default InstantChat;
