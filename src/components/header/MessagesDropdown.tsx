
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserMessages } from "@/services/DataService";

interface Message {
  id: number;
  name: string;
  message: string;
  time: string;
}

const MessagesDropdown = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Set a timeout to ensure we don't load for more than 5 seconds
        const timeoutPromise = new Promise<Message[]>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 5000);
        });
        
        try {
          const messagesPromise = fetchUserMessages(user.id);
          const messagesData = await Promise.race([messagesPromise, timeoutPromise]);
          setMessages(messagesData);
        } catch (error) {
          console.error("Error or timeout loading messages:", error);
          setMessages([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadMessages();
      
      // Reduce polling frequency to prevent unnecessary loads
      const interval = setInterval(loadMessages, 5 * 60 * 1000); // Every 5 minutes instead of 2
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare size={20} />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Messages</span>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
              <Link to="/chat">View All</Link>
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-gray-500">
            <Inbox className="h-12 w-12 mb-2 text-gray-400" />
            <p>No messages yet</p>
            <p className="text-xs mt-1">Start a conversation with your matches</p>
          </div>
        ) : (
          messages.map((message) => (
            <DropdownMenuItem key={message.id} className="p-3 cursor-pointer" asChild>
              <Link to="/chat" className="w-full">
                <div className="flex gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">{message.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm">{message.name}</p>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessagesDropdown;
