
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IncomingCallProps {
  contact: {
    contactId: string;
    contactName: string;
  };
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCall = ({ contact, onAccept, onDecline }: IncomingCallProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4 animate-pulse">
          <span className="text-3xl">{contact.contactName[0]}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Incoming Video Call</h3>
        <p className="mb-6">{contact.contactName} is calling you</p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="destructive" 
            className="rounded-full px-6"
            onClick={() => {
              toast.info(`Call from ${contact.contactName} declined`);
              onDecline();
            }}
          >
            Decline
          </Button>
          <Button 
            variant="default" 
            className="rounded-full px-6 bg-green-600 hover:bg-green-700"
            onClick={onAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
