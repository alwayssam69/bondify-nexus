
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsItem } from "@/types/custom";
import NewsCard from "./NewsCard";
import { toast } from "sonner";

const industries = [
  "All",
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
];

const NewsInsights = () => {
  const { profile } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      
      // Since we don't have proper Supabase integration for these tables yet,
      // let's use sample data instead of querying the database
      
      // This code would be used with actual database tables:
      // const { data, error } = await supabase
      //   .from('news_feed')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      //
      // if (error) {
      //   console.error("Error fetching news:", error);
      //   toast.error("Failed to load news insights");
      //   setIsLoading(false);
      //   return;
      // }
      //
      // const newsItems = data as NewsItem[];
      // setNews(newsItems);
      // setFilteredNews(newsItems);
      
      // Populate with sample data directly
      populateSampleNews();
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error in fetchNews:", error);
      setIsLoading(false);
      toast.error("An error occurred while fetching news");
    }
  };

  const populateSampleNews = async () => {
    try {
      const userIndustry = profile?.industry || "Technology";
      const sampleNews: NewsItem[] = [
        {
          id: "1",
          industry: userIndustry,
          title: "Latest Advancements in AI Technology",
          content: "Researchers have developed a new algorithm that improves natural language understanding by 30%. This breakthrough could transform how AI systems interpret human communication.",
          source_url: "https://example.com/ai-news",
          image_url: "https://via.placeholder.com/300x200?text=AI+News",
          timestamp: new Date().toISOString(),
          likes_count: 24,
          comments_count: 8
        },
        {
          id: "2",
          industry: "Finance",
          title: "Market Trends: Investment Opportunities in 2023",
          content: "Financial analysts predict significant growth in sustainable investments and digital currencies. Here's what you need to know about the upcoming market trends.",
          source_url: "https://example.com/finance-trends",
          image_url: "https://via.placeholder.com/300x200?text=Finance+News",
          timestamp: new Date().toISOString(),
          likes_count: 15,
          comments_count: 3
        },
        {
          id: "3",
          industry: "Healthcare",
          title: "Breakthrough in Medical Research",
          content: "A team of scientists has discovered a new method for early detection of certain types of cancer, potentially saving millions of lives through early intervention.",
          source_url: "https://example.com/healthcare-news",
          image_url: "https://via.placeholder.com/300x200?text=Healthcare+News",
          timestamp: new Date().toISOString(),
          likes_count: 32,
          comments_count: 12
        }
      ];
      
      setNews(sampleNews);
      setFilteredNews(sampleNews);
      
      // In a real app with proper database integration, we would insert these into Supabase:
      // for (const item of sampleNews) {
      //   await supabase
      //     .from('news_feed')
      //     .insert({
      //       industry: item.industry,
      //       title: item.title,
      //       content: item.content,
      //       source_url: item.source_url,
      //       image_url: item.image_url,
      //     });
      // }
    } catch (error) {
      console.error("Error populating sample news:", error);
    }
  };

  // Filter news by industry
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "All") {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.industry === value));
    }
  };

  // Search news
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === "") {
      // Reset to industry filter
      handleTabChange(activeTab);
      return;
    }
    
    // Filter by search query
    const filtered = news.filter(item => {
      const matchesIndustry = activeTab === "All" || item.industry === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(query) || 
                            item.content.toLowerCase().includes(query);
      return matchesIndustry && matchesSearch;
    });
    
    setFilteredNews(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Industry Insights</h1>
        <p className="text-muted-foreground">
          Latest news and trends relevant to your industry and interests
        </p>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search news and insights..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
        />
      </div>
      
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
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-0 overflow-hidden">
                <div className="flex flex-col">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : filteredNews.length > 0 ? (
            filteredNews.map(item => (
              <NewsCard key={item.id} news={item} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No news found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any news matching your criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                handleTabChange('All');
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsInsights;
