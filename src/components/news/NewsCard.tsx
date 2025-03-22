
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source_url: string;
  image_url: string | null;
  industry: string;
  timestamp: string;
  interactions: {
    liked: boolean;
    comment: string | null;
    user_id: string;
  }[];
}

interface NewsCardProps {
  news: NewsItem;
  onInteraction?: () => void;
}

const NewsCard = ({ news, onInteraction }: NewsCardProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Count total likes
  const likesCount = news.interactions.filter(i => i.liked).length;
  
  // Check if current user has liked
  const [hasLiked, setHasLiked] = useState(false);
  
  // Check if the current user has liked this news
  React.useEffect(() => {
    const checkUserLike = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const liked = news.interactions.some(
          i => i.user_id === userData.user.id && i.liked
        );
        setHasLiked(liked);
      }
    };
    
    checkUserLike();
  }, [news.interactions]);

  const handleLike = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to interact with news items",
          variant: "destructive",
        });
        return;
      }

      const { data: existingInteraction } = await supabase
        .from("news_interactions")
        .select("*")
        .eq("news_id", news.id)
        .eq("user_id", userData.user.id)
        .single();

      if (existingInteraction) {
        // Update existing interaction
        const { error } = await supabase
          .from("news_interactions")
          .update({ liked: !hasLiked })
          .eq("id", existingInteraction.id);

        if (error) throw error;
      } else {
        // Create new interaction
        const { error } = await supabase
          .from("news_interactions")
          .insert({
            news_id: news.id,
            user_id: userData.user.id,
            liked: true,
          });

        if (error) throw error;
      }

      setHasLiked(!hasLiked);
      if (onInteraction) onInteraction();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to comment",
          variant: "destructive",
        });
        return;
      }

      const { data: existingInteraction } = await supabase
        .from("news_interactions")
        .select("*")
        .eq("news_id", news.id)
        .eq("user_id", userData.user.id)
        .single();

      if (existingInteraction) {
        // Update existing interaction
        const { error } = await supabase
          .from("news_interactions")
          .update({ comment })
          .eq("id", existingInteraction.id);

        if (error) throw error;
      } else {
        // Create new interaction
        const { error } = await supabase
          .from("news_interactions")
          .insert({
            news_id: news.id,
            user_id: userData.user.id,
            comment,
          });

        if (error) throw error;
      }

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      });

      setComment("");
      setShowCommentForm(false);
      if (onInteraction) onInteraction();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      {news.image_url && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={news.image_url} 
            alt={news.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{news.title}</h3>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{formatDistanceToNow(new Date(news.timestamp), { addSuffix: true })}</span>
              <Badge variant="outline" className="text-xs py-0">{news.industry}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-4">{news.content}</p>
        
        <a 
          href={news.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          Read full article
        </a>
        
        {news.interactions.filter(i => i.comment).length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Comments</h4>
            <div className="space-y-3">
              {news.interactions
                .filter(i => i.comment)
                .map((interaction, idx) => (
                  <div key={idx} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">User</span>
                    </div>
                    <p className="text-sm">{interaction.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs ${hasLiked ? 'text-blue-500' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-blue-500' : ''}`} />
            {likesCount > 0 && likesCount}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Comment
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              navigator.clipboard.writeText(news.source_url);
              toast({
                title: "Link copied",
                description: "Article link copied to clipboard",
              });
            }}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
      
      {showCommentForm && (
        <div className="px-6 pb-4">
          <Textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2 resize-none"
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowCommentForm(false);
                setComment("");
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NewsCard;
