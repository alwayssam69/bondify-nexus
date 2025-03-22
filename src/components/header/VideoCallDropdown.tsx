
import React, { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
}

interface VideoCallDropdownProps {
  onInitiateCall: (contact: {id: string, name: string}) => void;
  onSimulateIncomingCall: () => void;
}

const VideoCallDropdown = ({ 
  onInitiateCall, 
  onSimulateIncomingCall
}: VideoCallDropdownProps) => {
  const { user } = useAuth();
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchRecentContacts();
    }
  }, [user]);
  
  const fetchRecentContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // Placeholder for actual database call
      const { data, error } = await supabase
        .from('connections')
        .select('id, contact_id, contact_name, avatar, last_connected')
        .eq('user_id', user.id)
        .order('last_connected', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching contacts:", error);
        return;
      }
      
      // If we have data, map it to our contact format
      if (data && data.length > 0) {
        setRecentContacts(data.map(contact => ({
          id: contact.contact_id,
          name: contact.contact_name,
          avatar: contact.avatar
        })));
      }
    } catch (error) {
      console.error("Error in fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const hasContacts = recentContacts && recentContacts.length > 0;
  
  const getInitial = (name: string) => name?.charAt(0) || "?";

  const getRandomGradient = (id: string) => {
    const colors = [
      "from-blue-400 to-indigo-600",
      "from-purple-400 to-pink-600",
      "from-green-400 to-teal-600",
      "from-red-400 to-pink-600",
      "from-amber-400 to-orange-600"
    ];
    
    // Use the id to deterministically select a gradient
    const index = id?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Video size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-gray-900 border-gray-800 text-gray-200 backdrop-blur-lg rounded-xl shadow-xl">
        <DropdownMenuLabel className="text-gray-200 font-semibold">Video Call</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto animate-spin mb-3"></div>
            <p className="text-sm text-gray-400">Loading contacts...</p>
          </div>
        ) : hasContacts ? (
          // Show real contacts
          recentContacts.map(contact => (
            <DropdownMenuItem 
              key={contact.id} 
              onClick={() => onInitiateCall(contact)}
              className="hover:bg-gray-800 focus:bg-gray-800 rounded-lg my-1 cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full p-1">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${contact.avatar || getRandomGradient(contact.id)} flex items-center justify-center text-white`}>
                  <span>{getInitial(contact.name)}</span>
                </div>
                <span>Call {contact.name}</span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          // Empty state when no contacts
          <div className="p-8 text-center">
            <div className="flex justify-center mb-3">
              <UserX className="h-12 w-12 text-gray-500" />
            </div>
            <h4 className="text-base font-medium text-gray-300 mb-2">No Recent Contacts</h4>
            <p className="text-sm text-gray-400">Connect with professionals to start video calls</p>
          </div>
        )}
        
        {/* Only show simulation button during development */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem onClick={onSimulateIncomingCall} className="hover:bg-gray-800 focus:bg-gray-800 rounded-lg my-1 cursor-pointer">
              <div className="flex items-center gap-3 w-full p-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white">
                  <span>S</span>
                </div>
                <span>Simulate Incoming Call</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoCallDropdown;
