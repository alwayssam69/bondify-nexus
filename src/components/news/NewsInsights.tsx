
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NewsCard, { NewsItem } from "./NewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const INDUSTRIES = [
  "All Industries",
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

const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Popular", value: "popular" },
];

const NewsInsights = () => {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");

  const fetchNews = async () => {
    let query = supabase
      .from("news_feed")
      .select(`
        *,
        interactions:news_interactions(*)
      `);

    if (activeIndustry && activeIndustry !== "All Industries") {
      query = query.eq("industry", activeIndustry);
    }

    query = query.order("timestamp", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    
    // Transform data to match the NewsItem interface
    const newsItems = data.map(item => ({
      ...item,
      interactions: item.interactions || [],
    })) as NewsItem[];

    // Sort by popularity if needed
    if (sortBy === "popular") {
      newsItems.sort((a, b) => {
        const aLikes = a.interactions.filter(i => i.liked).length;
        const bLikes = b.interactions.filter(i => i.liked).length;
        return bLikes - aLikes;
      });
    }
    
    return newsItems;
  };

  const { data: newsItems, isLoading, isError, refetch } = useQuery({
    queryKey: ["news", activeIndustry, sortBy],
    queryFn: fetchNews
  });

  // Loading dummy data for development/demo purposes
  const loadDummyData = async () => {
    // Only load if there's no data
    const { data: existingNews } = await supabase
      .from("news_feed")
      .select("id")
      .limit(1);
      
    if (existingNews && existingNews.length > 0) {
      return; // Data already exists
    }
    
    const dummyNews = [
      {
        industry: "Technology",
        title: "AI Revolutionizes Healthcare Diagnosis",
        content: "New AI algorithms are now capable of diagnosing diseases with 99% accuracy, outperforming human doctors in several specialized fields.",
        source_url: "https://example.com/ai-healthcare",
        image_url: "https://source.unsplash.com/random/800x600/?ai,healthcare",
      },
      {
        industry: "Finance",
        title: "Decentralized Finance Sees Record Growth",
        content: "DeFi platforms have surpassed $100 billion in total value locked, signaling mainstream adoption of blockchain-based financial services.",
        source_url: "https://example.com/defi-growth",
        image_url: "https://source.unsplash.com/random/800x600/?finance,blockchain",
      },
      {
        industry: "Marketing",
        title: "Social Commerce Transforms Retail Landscape",
        content: "Brands leveraging social media shopping features are seeing 300% higher conversion rates compared to traditional e-commerce approaches.",
        source_url: "https://example.com/social-commerce",
        image_url: "https://source.unsplash.com/random/800x600/?shopping,social",
      },
      {
        industry: "Technology",
        title: "Quantum Computing Breakthrough Announced",
        content: "Scientists have achieved quantum supremacy with a new 1000-qubit processor, solving problems impossible for classical computers.",
        source_url: "https://example.com/quantum-breakthrough",
        image_url: "https://source.unsplash.com/random/800x600/?quantum,computing",
      },
      {
        industry: "Healthcare",
        title: "Gene Editing Shows Promise for Inherited Diseases",
        content: "CRISPR-based therapies have successfully treated patients with sickle cell anemia in clinical trials, offering hope for genetic disorder treatments.",
        source_url: "https://example.com/gene-editing",
        image_url: "https://source.unsplash.com/random/800x600/?gene,dna",
      },
    ];
    
    for (const news of dummyNews) {
      await supabase.from("news_feed").insert(news);
    }
    
    // Refresh the data
    refetch();
  };

  // Load dummy data on component mount
  React.useEffect(() => {
    loadDummyData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          Industry Insights
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4 flex overflow-x-auto pb-1 scrollbar-hide">
          <TabsTrigger 
            value="all" 
            onClick={() => setActiveIndustry(null)}
          >
            All Industries
          </TabsTrigger>
          {INDUSTRIES.filter(i => i !== "All Industries").map((industry) => (
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
            <div className="text-center py-8">Loading news articles...</div>
          ) : isError ? (
            <div className="text-center text-red-500 py-8">Error loading news articles</div>
          ) : newsItems && newsItems.length > 0 ? (
            <div className="space-y-6">
              {newsItems.map((newsItem) => (
                <NewsCard 
                  key={newsItem.id} 
                  news={newsItem} 
                  onInteraction={() => refetch()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">No news articles found.</div>
          )}
        </TabsContent>
        
        {INDUSTRIES.filter(i => i !== "All Industries").map((industry) => (
          <TabsContent key={industry} value={industry}>
            {newsItems && newsItems.filter(n => n.industry === industry).length > 0 ? (
              newsItems.filter(n => n.industry === industry).map((newsItem) => (
                <NewsCard 
                  key={newsItem.id} 
                  news={newsItem} 
                  onInteraction={() => refetch()}
                />
              ))
            ) : (
              <div className="text-center py-8">No news articles found for {industry}.</div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NewsInsights;
