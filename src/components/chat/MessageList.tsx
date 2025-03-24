
import React, { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  loadingTimeout?: boolean;
  emptyMessage?: string;
}

const MessageList = ({ 
  messages, 
  isLoading, 
  loadingTimeout = false,
  emptyMessage = "No messages found" 
}: MessageListProps) => {
  const { user } = useAuth();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const formatTime = (timestamp: Date) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex-1 flex justify-center items-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!messages.length) {
    return (
      <div className="flex-1 flex justify-center items-center p-4 text-center">
        <div>
          <h3 className="font-medium mb-1">{emptyMessage}</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to send a message and start the conversation
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isSentByMe = message.sender === user?.id;
          
          return (
            <div key={message.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  isSentByMe 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isSentByMe 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default MessageList;
