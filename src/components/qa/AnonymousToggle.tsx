
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface AnonymousToggleProps {
  isAnonymous: boolean;
  onToggle: (isAnonymous: boolean) => void;
  className?: string;
}

const AnonymousToggle = ({ isAnonymous, onToggle, className }: AnonymousToggleProps) => {
  return (
    <div className={`flex items-center justify-between space-x-2 p-2 rounded-lg bg-muted/50 ${className || ""}`}>
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAnonymous ? 'bg-gray-700' : 'bg-blue-500'}`}>
          {isAnonymous ? (
            <User className="w-4 h-4 text-gray-300" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <Label htmlFor="anonymous-mode" className="text-sm font-medium">
          {isAnonymous ? "Anonymous Mode" : "Post Publicly"}
        </Label>
      </div>
      <Switch
        id="anonymous-mode"
        checked={isAnonymous}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default AnonymousToggle;
