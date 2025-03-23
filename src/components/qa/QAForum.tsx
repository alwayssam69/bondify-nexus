
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question } from "@/types/custom";
import QuestionForm from "./QuestionForm";
import QuestionCard from "./QuestionCard";
import { toast } from "sonner";

const industries = ["All", "Technology", "Finance", "Healthcare", "Education", "Marketing", "Design"];

const QAForum = () => {
  const { user, profile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, we would have this table created in Supabase
      // For now, let's use type assertions to handle the missing table issue
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          user:user_id(full_name, image_url, expert_verified)
        `)
        .order('created_at', { ascending: false }) as unknown as {
          data: any[];
          error: any;
        };

      if (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions");
        setIsLoading(false);
        return;
      }

      // Convert to our Question type
      const questionData = (data || []) as unknown as Question[];
      setQuestions(questionData);
      setFilteredQuestions(questionData);
      setIsLoading(false);
      
      // If no questions exist, add some sample data
      if (questionData.length === 0) {
        populateSampleQuestions();
      }
    } catch (error) {
      console.error("Error in fetchQuestions:", error);
      setIsLoading(false);
      toast.error("An error occurred while fetching questions");
    }
  };

  const populateSampleQuestions = () => {
    const userIndustry = profile?.industry || "Technology";
    
    const sampleQuestions: Question[] = [
      {
        id: "1",
        user_id: user?.id || "anonymous",
        content: "What strategies do you recommend for networking effectively in the tech industry?",
        industry: userIndustry,
        anonymous: false,
        timestamp: new Date().toISOString(),
        user: {
          full_name: profile?.full_name || "Anonymous User",
          expert_verified: false
        },
        answers_count: 2
      },
      {
        id: "2",
        user_id: "expert123",
        content: "How do you approach work-life balance in a high-pressure industry?",
        industry: "Finance",
        anonymous: false,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        user: {
          full_name: "Finance Expert",
          expert_verified: true
        },
        answers_count: 5
      },
      {
        id: "3",
        user_id: "anonymous",
        content: "What certifications are most valuable for career advancement?",
        industry: "Healthcare",
        anonymous: true,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        user: {
          full_name: "Anonymous User",
          expert_verified: false
        },
        answers_count: 3
      }
    ];
    
    setQuestions(sampleQuestions);
    setFilteredQuestions(sampleQuestions);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "All") {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.industry === value));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === "") {
      handleTabChange(activeTab);
      return;
    }
    
    const filtered = questions.filter(q => {
      const matchesIndustry = activeTab === "All" || q.industry === activeTab;
      const matchesQuery = q.content.toLowerCase().includes(query);
      return matchesIndustry && matchesQuery;
    });
    
    setFilteredQuestions(filtered);
  };

  const handleQuestionAdded = (newQuestion: Question) => {
    setQuestions([newQuestion, ...questions]);
    setFilteredQuestions([newQuestion, ...filteredQuestions]);
    setShowQuestionForm(false);
    toast.success("Question posted successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Industry Q&A Forum</h1>
        <p className="text-muted-foreground">
          Ask questions and get insights from industry experts
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1"
        />
        
        <Button 
          onClick={() => setShowQuestionForm(!showQuestionForm)}
          className="whitespace-nowrap"
        >
          {showQuestionForm ? "Cancel" : "Ask a Question"}
        </Button>
      </div>
      
      {showQuestionForm && (
        <div className="mb-6 bg-card rounded-lg p-6 border shadow-sm">
          <QuestionForm onQuestionAdded={handleQuestionAdded} />
        </div>
      )}
      
      <Tabs defaultValue="All" value={activeTab} onValueChange={handleTabChange}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start mb-6">
            {industries.map(industry => (
              <TabsTrigger key={industry} value={industry} className="px-4">
                {industry}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading questions...</p>
            </div>
          ) : filteredQuestions.length > 0 ? (
            filteredQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "We couldn't find any questions matching your search"
                  : "Be the first to ask a question in this category!"}
              </p>
              <Button onClick={() => setShowQuestionForm(true)}>
                Ask a Question
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QAForum;
