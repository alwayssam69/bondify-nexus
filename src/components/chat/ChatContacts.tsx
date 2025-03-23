
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatContact } from "@/types/chat";

interface ChatContactsProps {
  contacts: ChatContact[];
  activeContact: string | null;
  setActiveContact: (id: string) => void;
  isLoading?: boolean;
}

const ChatContacts = ({ contacts, activeContact, setActiveContact, isLoading = false }: ChatContactsProps) => {
  return (
    <div className="border-r border-border">
      <div className="p-4">
        <Input 
          placeholder="Search conversations..." 
          className="mb-4"
        />
      </div>
      
      <ScrollArea className="h-[540px]">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Connect with people to start chatting</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`p-4 border-b border-border last:border-0 cursor-pointer hover:bg-secondary/50 ${activeContact === contact.id ? 'bg-secondary' : ''}`}
              onClick={() => setActiveContact(contact.id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${contact.avatar || 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg font-light">{contact.name[0]}</span>
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{contact.name}</p>
                    {(contact.unreadCount > 0 || (contact.unread !== undefined && contact.unread > 0)) && (
                      <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {contact.unreadCount || contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatContacts;
