
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProfileAlertProps {
  isProfileIncomplete: boolean;
}

const ProfileAlert = ({ isProfileIncomplete }: ProfileAlertProps) => {
  if (!isProfileIncomplete) return null;
  
  return (
    <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle>Your profile is incomplete</AlertTitle>
      <AlertDescription>
        Please update your details to improve your matching quality and help others find you.
      </AlertDescription>
    </Alert>
  );
};

export default ProfileAlert;
