
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
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
  );
};

export default MessageList;
