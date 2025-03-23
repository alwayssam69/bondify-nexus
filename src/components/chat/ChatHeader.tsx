
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChatContact } from "@/types/chat";

interface ChatHeaderProps {
  contact: ChatContact;
  onInitiateVideoCall: () => void;
}

const ChatHeader = ({ contact, onInitiateVideoCall }: ChatHeaderProps) => {
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

  // Use the avatar property or fall back to a default background color
  const avatarClass = contact.avatar || "bg-blue-100 text-blue-600";

  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${avatarClass} flex items-center justify-center`}>
          <span className="text-base font-light">{contact.name[0]}</span>
        </div>
        <div>
          <p className="font-medium">{contact.name}</p>
          <p className="text-xs text-muted-foreground">
            {contact.online ? (
              <span className="text-green-500">Online now</span>
            ) : (
              formatLastSeen(contact.lastSeen)
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
          variant={contact.online ? "ghost" : "outline"} 
          size="icon" 
          title="Video Call"
          onClick={onInitiateVideoCall}
          disabled={!contact.online}
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
  );
};

export default ChatHeader;
