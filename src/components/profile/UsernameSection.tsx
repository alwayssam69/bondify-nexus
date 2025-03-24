
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./ProfileFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";

interface UsernameSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const UsernameSection: React.FC<UsernameSectionProps> = ({ form }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) return;
    
    setIsChecking(true);
    setIsAvailable(null);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_tag')
        .eq('user_tag', username)
        .maybeSingle();
      
      if (error) throw error;
      
      // Username is available if no data returned
      setIsAvailable(!data);
    } catch (error) {
      console.error("Error checking username availability:", error);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <FormField
      control={form.control}
      name="userTag"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                @
              </div>
              <Input
                placeholder="username"
                className="pl-8 pr-10"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  checkUsernameAvailability(e.target.value);
                }}
              />
              {field.value && field.value.length >= 3 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isChecking ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                  ) : isAvailable === true ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : isAvailable === false ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : null}
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Choose a unique username. This will be your public identifier.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UsernameSection;
