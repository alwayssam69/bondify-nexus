import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Video, UserX } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
}

interface VideoCallDropdownProps {
  onInitiateCall: (contact: {id: string, name: string}) => void;
  onSimulateIncomingCall: () => void;
  recentContacts?: Contact[];
}

const VideoCallDropdown = ({ 
  onInitiateCall, 
  onSimulateIncomingCall, 
  recentContacts = [] 
}: VideoCallDropdownProps) => {
  // If no real contacts are provided, we'll show an empty state
  const hasContacts = recentContacts && recentContacts.length > 0;
  
  const getInitial = (name: string) => name.charAt(0);

  const getRandomGradient = (id: string) => {
    const colors = [
      "from-blue-400 to-indigo-600",
      "from-purple-400 to-pink-600",
      "from-green-400 to-teal-600",
      "from-red-400 to-pink-600",
      "from-amber-400 to-orange-600"
    ];
    
    // Use the id to deterministically select a gradient
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Video size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-gray-900 border-gray-800 text-gray-200">
        <DropdownMenuLabel className="text-gray-200">Video Call</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        
        {hasContacts ? (
          // Show real contacts
          recentContacts.map(contact => (
            <DropdownMenuItem 
              key={contact.id} 
              onClick={() => onInitiateCall(contact)}
              className="hover:bg-gray-800"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${contact.avatar || getRandomGradient(contact.id)} flex items-center justify-center text-white`}>
                  <span>{getInitial(contact.name)}</span>
                </div>
                <span>Call {contact.name}</span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          // Empty state when no contacts
          <div className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <UserX className="h-10 w-10 text-gray-500" />
            </div>
            <p className="text-sm text-gray-400">No recent contacts</p>
            <p className="text-xs text-gray-500 mt-1">Connect with professionals to start video calls</p>
          </div>
        )}
        
        {/* Keep the simulation option for demo purposes */}
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem onClick={onSimulateIncomingCall} className="hover:bg-gray-800">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white">
              <span>S</span>
            </div>
            <span>Simulate Incoming Call</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoCallDropdown;
