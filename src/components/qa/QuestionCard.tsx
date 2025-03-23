
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, User, Clock, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Question, Answer } from "@/types/custom";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { user, profile } = useAuth();
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answersCount, setAnswersCount] = useState(question.answers_count || 0);
  const [isLoading, setIsLoading] = useState(false);
  
  const timeAgo = formatDistanceToNow(new Date(question.timestamp), { addSuffix: true });
  
  const toggleAnswers = async () => {
    if (!showAnswers && answers.length === 0) {
      setIsLoading(true);
      try {
        // Since we don't have proper Supabase integration for these tables yet,
        // let's use sample data instead of querying the database

        // This code would be used with actual database tables:
        // const { data, error } = await supabase
        //   .from('answers')
        //   .select(`
        //     *,
        //     expert:expert_id(full_name, image_url)
        //   `)
        //   .eq('question_id', question.id)
        //   .order('created_at', { ascending: false });
        // 
        // if (error) throw error;
        // setAnswers(data as Answer[]);
        
        // Sample data if we have an answers count > 0
        if (answersCount > 0) {
          const sampleAnswers: Answer[] = [
            {
              id: "a1-" + question.id,
              question_id: question.id,
              expert_id: "expert123",
              content: "This is a great question. In my experience, networking effectively in the tech industry involves attending relevant meetups, being active in online communities, and contributing to open source projects.",
              timestamp: new Date().toISOString(),
              expert: {
                full_name: "Tech Expert",
                image_url: "https://via.placeholder.com/40"
              }
            },
            {
              id: "a2-" + question.id,
              question_id: question.id,
              expert_id: "expert456",
              content: "I would add that LinkedIn can be a powerful tool if used effectively. Don't just connect with people, but engage meaningfully with their content and share your own insights regularly.",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              expert: {
                full_name: "Career Coach",
                image_url: "https://via.placeholder.com/40"
              }
            }
          ];
          setAnswers(sampleAnswers);
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
        toast.error("Failed to load answers");
      } finally {
        setIsLoading(false);
      }
    }
    
    setShowAnswers(!showAnswers);
  };
  
  const submitAnswer = async () => {
    if (!user) {
      toast.error("Please log in to answer questions");
      return;
    }
    
    if (!answerText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the new answer to the list for immediate UI feedback
      const newAnswer: Answer = {
        id: Date.now().toString(),
        question_id: question.id,
        expert_id: user.id,
        content: answerText.trim(),
        timestamp: new Date().toISOString(),
        expert: {
          full_name: profile?.full_name || "Anonymous User",
          image_url: profile?.image_url,
        }
      };
      
      setAnswers([newAnswer, ...answers]);
      setAnswerText("");
      setAnswersCount(prev => prev + 1);
      toast.success("Answer posted successfully");
      
      // This code would be used with actual database tables:
      // const { error } = await supabase
      //   .from('answers')
      //   .insert({
      //     question_id: question.id,
      //     expert_id: user.id,
      //     content: answerText.trim(),
      //   });
      // 
      // if (error) throw error;
    } catch (error) {
      console.error("Error posting answer:", error);
      toast.error("Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          {question.anonymous ? (
            <div className="bg-gray-700 w-full h-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
          ) : (
            <>
              <AvatarImage src={question.user?.image_url} />
              <AvatarFallback>{question.user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">
              {question.anonymous ? "Anonymous User" : question.user?.full_name}
            </h3>
            
            {question.user?.expert_verified && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Award className="w-3 h-3" />
                Expert
              </Badge>
            )}
            
            <Badge variant="secondary" className="ml-auto">
              {question.industry}
            </Badge>
          </div>
          
          <p className="mb-3">{question.content}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{timeAgo}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={toggleAnswers}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{answersCount || 0} {answersCount === 1 ? 'Answer' : 'Answers'}</span>
            </Button>
          </div>
          
          {/* Answers Section */}
          {showAnswers && (
            <div className="mt-4 pt-4 border-t">
              {/* Answer Form */}
              {user && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Your Answer</h4>
                  <Textarea 
                    placeholder="Write your answer here..." 
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="mb-2"
                    rows={3}
                  />
                  <Button 
                    onClick={submitAnswer} 
                    disabled={isSubmitting || !answerText.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Answer'}
                  </Button>
                </div>
              )}
              
              {/* Answer List */}
              <div className="space-y-4">
                <h4 className="font-medium">
                  {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                </h4>
                
                {isLoading ? (
                  <p className="text-center py-4 text-muted-foreground">Loading answers...</p>
                ) : answers.length > 0 ? (
                  answers.map(answer => (
                    <div key={answer.id} className="pb-4 border-b last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={answer.expert?.image_url} />
                          <AvatarFallback>
                            {answer.expert?.full_name?.charAt(0) || 'E'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-sm">
                              {answer.expert?.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDistanceToNow(new Date(answer.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className="text-sm">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No answers yet. Be the first to answer!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
