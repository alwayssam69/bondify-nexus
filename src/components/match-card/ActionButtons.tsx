
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Link as LinkIcon, Phone } from "lucide-react";

interface ActionButtonsProps {
  onViewProfile: () => void;
  onConnect: () => void;
}

const ActionButtons = ({ onViewProfile, onConnect }: ActionButtonsProps) => {
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = () => {
    onConnect();
    setIsConnected(true);
  };

  return (
    <div className="flex gap-2 px-5 pb-5">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-1/3 rounded-full bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 backdrop-blur-sm"
        onClick={onViewProfile}
      >
        <MessageCircle className="mr-1 h-4 w-4" />
        Chat
      </Button>
      <Button 
        variant="outline"
        size="sm" 
        className="w-1/3 rounded-full bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 backdrop-blur-sm"
        onClick={onViewProfile}
      >
        <Phone className="mr-1 h-4 w-4" />
        Call
      </Button>
      <Button 
        size="sm" 
        className={`w-1/3 rounded-full backdrop-blur-sm ${isConnected 
          ? 'bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'}`}
        onClick={handleConnect}
        disabled={isConnected}
      >
        {isConnected ? (
          <>
            <LinkIcon className="mr-1 h-4 w-4" />
            Connected
          </>
        ) : (
          <>
            <LinkIcon className="mr-1 h-4 w-4" />
            Connect
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
