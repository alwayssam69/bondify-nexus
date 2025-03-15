
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare } from "lucide-react";

interface Message {
  id: number;
  name: string;
  message: string;
  time: string;
}

const MessagesDropdown = () => {
  const navigate = useNavigate();
  
  const messages: Message[] = [
    { id: 1, name: "Alex Johnson", message: "Hey, how are you doing?", time: "10m" },
    { id: 2, name: "Taylor Moore", message: "I saw you like hiking too!", time: "25m" },
    { id: 3, name: "Jamie Chen", message: "Thanks for accepting my connection!", time: "1h" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Messages</span>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate("/chat")}>
              View All
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {messages.map((message) => (
          <DropdownMenuItem key={message.id} className="p-3 cursor-pointer" onClick={() => navigate("/chat")}>
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
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessagesDropdown;
