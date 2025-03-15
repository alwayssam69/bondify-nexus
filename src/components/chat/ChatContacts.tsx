
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatContact } from "@/types/chat";

interface ChatContactsProps {
  contacts: ChatContact[];
  activeContact: string | null;
  setActiveContact: (id: string) => void;
}

const ChatContacts = ({ contacts, activeContact, setActiveContact }: ChatContactsProps) => {
  return (
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
  );
};

export default ChatContacts;
