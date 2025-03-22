
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import QuestionForm from "./QuestionForm";
import QuestionCard, { Question } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const QAForum = () => {
  const [showForm, setShowForm] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const fetchQuestions = async () => {
    let query = supabase
      .from("questions")
      .select(`
        *,
        user:user_id (
          id,
          name:user_profiles!user_id(full_name),
          avatar_url:user_profiles!user_id(avatar_url)
        ),
        answers(
          *,
          expert:expert_id (
            id,
            name:user_profiles!user_id(full_name),
            avatar_url:user_profiles!user_id(avatar_url),
            expert_verified:user_profiles!user_id(expert_verified)
          )
        )
      `)
      .order("timestamp", { ascending: false });

    if (activeIndustry) {
      query = query.eq("industry", activeIndustry);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return data as Question[];
  };

  const { data: questions, isLoading, isError, refetch } = useQuery({
    queryKey: ["questions", activeIndustry],
    queryFn: fetchQuestions
  });

  // Check if the current user is an expert
  useEffect(() => {
    const checkExpertStatus = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("expert_verified")
          .eq("user_id", data.user.id)
          .single();
        
        setIsExpert(profileData?.expert_verified || false);
      }
    };

    checkExpertStatus();
  }, []);

  // Get unique industries from questions
  const industries = questions ? 
    Array.from(new Set(questions.map(q => q.industry))) : 
    [];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          Industry Q&A Forum
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            {showForm ? "Hide Form" : "Ask Question"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <QuestionForm />
        </div>
      )}

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setActiveIndustry(null)}>
            All Industries
          </TabsTrigger>
          {industries.map((industry) => (
            <TabsTrigger 
              key={industry} 
              value={industry}
              onClick={() => setActiveIndustry(industry)}
            >
              {industry}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : isError ? (
            <div className="text-center text-red-500 py-8">Error loading questions</div>
          ) : questions && questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard 
                  key={question.id} 
                  question={question} 
                  isExpert={isExpert}
                  onAnswerAdded={() => refetch()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">No questions found. Be the first to ask!</div>
          )}
        </TabsContent>
        
        {industries.map((industry) => (
          <TabsContent key={industry} value={industry}>
            {questions && questions.filter(q => q.industry === industry).map((question) => (
              <QuestionCard 
                key={question.id} 
                question={question} 
                isExpert={isExpert}
                onAnswerAdded={() => refetch()}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default QAForum;
