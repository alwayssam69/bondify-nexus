
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import AnonymousToggle from "./AnonymousToggle";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for questions
const generateMockQuestions = () => {
  // Generate random data to create variety
  const random = Math.floor(Math.random() * 1000);
  
  return [
    {
      id: `q1-${random}`,
      title: "How do I negotiate a higher salary?",
      body: "I've been offered a new position but the salary is lower than expected. What strategies can I use to negotiate better terms without risking the offer?",
      tags: ["career", "negotiation", "salary"],
      authorName: "Jennifer K.",
      authorAvatar: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      votes: 32 + Math.floor(Math.random() * 5),
      commentsCount: 8 + Math.floor(Math.random() * 3),
      isAnonymous: false
    },
    {
      id: `q2-${random}`,
      title: "Best ways to network as an introvert?",
      body: "I struggle with traditional networking events. Are there effective strategies for building professional connections that don't involve large social gatherings?",
      tags: ["networking", "introvert", "career-development"],
      authorName: "Anonymous",
      authorAvatar: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      votes: 47 + Math.floor(Math.random() * 5),
      commentsCount: 15 + Math.floor(Math.random() * 3),
      isAnonymous: true
    },
    {
      id: `q3-${random}`,
      title: "Transitioning from corporate to startup?",
      body: "After 10 years in a large corporation, I'm considering joining a startup. What should I expect and how can I prepare for this transition?",
      tags: ["career-change", "startup", "corporate"],
      authorName: "Michael T.",
      authorAvatar: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      votes: 28 + Math.floor(Math.random() * 5),
      commentsCount: 12 + Math.floor(Math.random() * 3),
      isAnonymous: false
    },
    {
      id: `q4-${random}`,
      title: "How to stay relevant in a rapidly changing industry?",
      body: "Technology in my field is evolving quickly. What strategies do you recommend for staying current and maintaining competitive skills?",
      tags: ["professional-development", "skills", "technology"],
      authorName: "Sarah J.",
      authorAvatar: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      votes: 36 + Math.floor(Math.random() * 5),
      commentsCount: 9 + Math.floor(Math.random() * 3),
      isAnonymous: false
    },
    {
      id: `q5-${random}`,
      title: "Work-life balance strategies that actually work?",
      body: "I'm finding it increasingly difficult to maintain boundaries between work and personal life, especially while working remotely. What practical strategies have worked for you?",
      tags: ["work-life-balance", "remote-work", "wellbeing"],
      authorName: "Anonymous",
      authorAvatar: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      votes: 52 + Math.floor(Math.random() * 5),
      commentsCount: 21 + Math.floor(Math.random() * 3),
      isAnonymous: true
    }
  ];
};

type Question = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  votes: number;
  commentsCount: number;
  isAnonymous: boolean;
};

const QAForum = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    fetchQuestions();
    
    // Auto-refresh every 15 minutes
    const refreshInterval = setInterval(() => {
      fetchQuestions(false);
      setLastRefreshed(new Date());
    }, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchQuestions = async (showToast = true) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('questions')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      //
      // if (error) throw error;
      // setQuestions(data as Question[]);
      // setFilteredQuestions(data as Question[]);
      
      // Using mock data for demonstration
      const mockData = generateMockQuestions();
      setQuestions(mockData);
      filterQuestions(mockData, activeTab, searchQuery);
      
      if (showToast) {
        toast.success("Questions refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      if (showToast) {
        toast.error("Failed to load questions");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuestions = (
    questionsData: Question[], 
    tab: string, 
    query: string
  ) => {
    let filtered = [...questionsData];
    
    // Filter by tab
    if (tab === "my-questions") {
      filtered = filtered.filter(q => !q.isAnonymous && q.authorName === user?.displayName);
    } else if (tab === "unanswered") {
      filtered = filtered.filter(q => q.commentsCount === 0);
    }
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(lowerQuery) || 
        q.body.toLowerCase().includes(lowerQuery) ||
        q.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    setFilteredQuestions(filtered);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterQuestions(questions, value, searchQuery);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterQuestions(questions, activeTab, query);
  };

  const handleSubmitQuestion = (title: string, body: string, tags: string[]) => {
    const newQuestion: Question = {
      id: `new-${Date.now()}`,
      title,
      body,
      tags,
      authorName: isAnonymous ? "Anonymous" : user?.displayName || "User",
      authorAvatar: isAnonymous ? null : user?.photoURL || null,
      createdAt: new Date().toISOString(),
      votes: 0,
      commentsCount: 0,
      isAnonymous
    };
    
    // In a real implementation, this would save to Supabase
    // await supabase.from('questions').insert([newQuestion]);
    
    setQuestions([newQuestion, ...questions]);
    setFilteredQuestions([newQuestion, ...filteredQuestions]);
    setIsFormOpen(false);
    toast.success("Your question has been posted");
  };

  // Calculate time since last refresh
  const getLastRefreshedText = () => {
    const minutes = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 60000);
    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Q&A Forum</h1>
          <p className="text-muted-foreground mt-1">
            Ask questions and share knowledge with professionals in your network
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 items-center">
          <span className="text-sm text-muted-foreground mr-2">Last updated: {getLastRefreshedText()}</span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => fetchQuestions()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <AnonymousToggle 
          isAnonymous={isAnonymous} 
          onToggle={setIsAnonymous}
          className="w-full sm:w-auto"
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="all">All Questions</TabsTrigger>
          <TabsTrigger value="my-questions">My Questions</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredQuestions.length > 0 ? (
            <ScrollArea className="h-[600px] rounded-md">
              <div className="space-y-4 pr-4">
                {filteredQuestions.map((question) => (
                  <QuestionCard 
                    key={question.id} 
                    question={question} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === "my-questions" 
                  ? "You haven't asked any questions yet" 
                  : activeTab === "unanswered" 
                    ? "There are no unanswered questions at the moment"
                    : "No questions matching your search criteria"}
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ask a Question
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Question Form Dialog */}
      {isFormOpen && (
        <QuestionForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitQuestion}
          isAnonymous={isAnonymous}
        />
      )}
    </div>
  );
};

export default QAForum;
