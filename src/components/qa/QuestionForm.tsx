
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnonymousToggle from "./AnonymousToggle";
import { Question } from "@/types/custom";

interface QuestionFormProps {
  onQuestionAdded: (question: Question) => void;
}

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Other"
];

const QuestionForm: React.FC<QuestionFormProps> = ({ onQuestionAdded }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [industry, setIndustry] = useState(profile?.industry || industries[0]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post a question");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter your question");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app with proper tables in Supabase:
      const { error } = await supabase
        .from('questions')
        .insert({
          user_id: user.id,
          content: content.trim(),
          industry,
          anonymous: isAnonymous,
        }) as unknown as { error: any };
      
      if (error) throw error;
      
      // Create the new question object to return
      const newQuestion: Question = {
        id: Date.now().toString(), // temporary ID until refresh
        user_id: user.id,
        content: content.trim(),
        industry,
        anonymous: isAnonymous,
        timestamp: new Date().toISOString(),
        user: isAnonymous 
          ? { full_name: "Anonymous User" }
          : { 
              full_name: profile?.full_name || "User",
              image_url: profile?.image_url,
              expert_verified: false
            },
        answers_count: 0
      };
      
      onQuestionAdded(newQuestion);
      setContent("");
      setIndustry(profile?.industry || industries[0]);
      setIsAnonymous(false);
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to submit question");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6">
        <p className="mb-4">You need to be logged in to ask questions</p>
        <Button>Log In</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium mb-4">Ask the Community</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Question
          </label>
          <Textarea
            placeholder="Type your question here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Industry
          </label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <AnonymousToggle 
          isAnonymous={isAnonymous} 
          onChange={setIsAnonymous} 
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post Question"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
