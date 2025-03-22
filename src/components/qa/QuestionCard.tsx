
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Question {
  id: string;
  content: string;
  industry: string;
  timestamp: string;
  anonymous: boolean;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
  answers: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  timestamp: string;
  expert: {
    id: string;
    name: string | null;
    avatar_url: string | null;
    expert_verified: boolean;
  };
}

interface QuestionCardProps {
  question: Question;
  isExpert?: boolean;
  onAnswerAdded?: () => void;
}

const QuestionCard = ({ 
  question, 
  isExpert = false,
  onAnswerAdded
}: QuestionCardProps) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitAnswer = async () => {
    if (!answerContent.trim()) {
      toast({
        title: "Empty answer",
        description: "Please provide an answer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("You must be logged in to answer a question");
      }

      const { error } = await supabase.from("answers").insert({
        question_id: question.id,
        expert_id: userData.user.id,
        content: answerContent,
      });

      if (error) throw error;

      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully!",
      });

      setAnswerContent("");
      setShowAnswerForm(false);
      if (onAnswerAdded) onAnswerAdded();
    } catch (error) {
      toast({
        title: "Error posting answer",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {question.anonymous ? (
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-300" />
              </div>
            ) : (
              <Avatar>
                <AvatarImage src={question.user.avatar_url || ""} />
                <AvatarFallback>{question.user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <div className="font-medium">
                {question.anonymous ? "Anonymous" : question.user.name || "Unknown User"}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}</span>
                <Badge variant="outline" className="text-xs py-0">{question.industry}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{question.content}</p>
        
        {question.answers.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-3">Answers</h4>
            <div className="space-y-4">
              {question.answers.map((answer) => (
                <div key={answer.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={answer.expert.avatar_url || ""} />
                      <AvatarFallback>{answer.expert.name?.charAt(0) || "E"}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{answer.expert.name}</span>
                      {answer.expert.expert_verified && (
                        <Badge variant="default" className="ml-2 text-xs">Expert</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(answer.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{answer.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        {isExpert && (
          <>
            {!showAnswerForm ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => setShowAnswerForm(true)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Answer as Expert
              </Button>
            ) : (
              <div className="w-full space-y-2">
                <Textarea
                  placeholder="Write your answer..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowAnswerForm(false);
                      setAnswerContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={submitAnswer}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
