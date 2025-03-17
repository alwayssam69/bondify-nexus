
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
import { Video } from "lucide-react";
import { toast } from "sonner";

interface VideoCallDropdownProps {
  onInitiateCall: (contact: {id: string, name: string}) => void;
  onSimulateIncomingCall: () => void;
}

const VideoCallDropdown = ({ onInitiateCall, onSimulateIncomingCall }: VideoCallDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Video size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Video Call</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onInitiateCall({id: "1", name: "Alex J."})}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white">
              <span>A</span>
            </div>
            <span>Call Alex J.</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onInitiateCall({id: "2", name: "Taylor M."})}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white">
              <span>T</span>
            </div>
            <span>Call Taylor M.</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSimulateIncomingCall}>
          <div className="flex items-center gap-3">
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
