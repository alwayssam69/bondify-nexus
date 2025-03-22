
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AnonymousToggle from "./AnonymousToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Marketing",
  "Healthcare",
  "Education",
  "Engineering",
  "Retail",
  "Media",
  "Legal",
  "Design",
];

const QuestionForm = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [question, setQuestion] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !industry) {
      toast({
        title: "Missing information",
        description: "Please provide both a question and select an industry",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to post a question");
      }
      
      const { error } = await supabase.from("questions").insert({
        user_id: userData.user.id,
        industry,
        content: question,
        anonymous: isAnonymous,
      });
      
      if (error) throw error;
      
      toast({
        title: "Question posted",
        description: "Your question has been posted successfully!",
      });
      
      // Reset form
      setQuestion("");
      setIndustry("");
      setIsAnonymous(false);
    } catch (error) {
      toast({
        title: "Error posting question",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Ask Industry Experts</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Textarea
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="resize-none"
          />
          
          <AnonymousToggle 
            isAnonymous={isAnonymous} 
            onChange={setIsAnonymous} 
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => {
            setQuestion("");
            setIndustry("");
            setIsAnonymous(false);
          }}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Question"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuestionForm;
