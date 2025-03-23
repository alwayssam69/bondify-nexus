
import React from "react";

const EmptyChat = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
        <p className="text-muted-foreground">Select a connection from the sidebar or match with someone new to start chatting</p>
      </div>
    </div>
  );
};

export default EmptyChat;
