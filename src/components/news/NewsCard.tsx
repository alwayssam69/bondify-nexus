
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, MessageSquare, Share2, Clock, ExternalLink } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NewsItem, NewsInteraction } from "@/types/custom";

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { user, profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(news.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(news.comments_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<NewsInteraction[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format the date for display
  const formattedDate = news.timestamp ? format(new Date(news.timestamp), 'MMM d, yyyy') : '';
  const timeAgo = news.timestamp ? formatDistanceToNow(new Date(news.timestamp), { addSuffix: true }) : '';
  
  // Handle like button click
  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like articles");
      return;
    }
    
    try {
      // In a real app with proper table integration, we would check for existing likes
      // and update the database. For now, we'll just update the local state.
      setLiked(!liked);
      setLikesCount(prevCount => liked ? Math.max(0, prevCount - 1) : prevCount + 1);
      toast.success(liked ? "Removed like" : "Added like");
      
      // This code would be used with real database tables:
      // const { data: existingLikes } = await supabase
      //   .from('news_interactions')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .eq('news_id', news.id)
      //   .eq('liked', true);
      
      // if (existingLikes && existingLikes.length > 0) {
      //   await supabase
      //     .from('news_interactions')
      //     .update({ liked: false })
      //     .eq('id', existingLikes[0].id);
      //   
      //   setLiked(false);
      //   setLikesCount(prev => Math.max(0, prev - 1));
      //   toast.success("Removed like");
      // } else {
      //   await supabase
      //     .from('news_interactions')
      //     .insert({
      //       news_id: news.id,
      //       user_id: user.id,
      //       liked: true,
      //     });
      //   
      //   setLiked(true);
      //   setLikesCount(prev => prev + 1);
      //   toast.success("Added like");
      // }
    } catch (error) {
      console.error("Error liking article:", error);
      toast.error("Failed to update like status");
    }
  };
  
  // Toggle comments section
  const toggleComments = async () => {
    setShowComments(!showComments);
    
    if (!showComments && comments.length === 0) {
      try {
        // In a real app, we would fetch comments from the database
        // For now, let's simulate it with sample data
        const sampleComments: NewsInteraction[] = [
          {
            id: "comment1",
            user_id: "user1",
            news_id: news.id,
            comment: "This is a really insightful article! Thanks for sharing.",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "comment2",
            user_id: "user2",
            news_id: news.id,
            comment: "I found this perspective interesting, though I wonder about the implications for smaller businesses.",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          }
        ];
        
        setComments(sampleComments);
        
        // This code would be used with real database tables:
        // const { data, error } = await supabase
        //   .from('news_interactions')
        //   .select('*')
        //   .eq('news_id', news.id)
        //   .not('comment', 'is', null)
        //   .order('created_at', { ascending: false });
        //
        // if (error) throw error;
        // setComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      }
    }
  };
  
  // Submit a new comment
  const submitComment = async () => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the new comment object
      const newComment: NewsInteraction = {
        id: Date.now().toString(), // temporary ID
        news_id: news.id,
        user_id: user.id,
        comment: commentText.trim(),
        created_at: new Date().toISOString(),
      };
      
      // Add the new comment to the list
      setComments([newComment, ...comments]);
      setCommentText("");
      setCommentsCount(prev => prev + 1);
      toast.success("Comment added");
      
      // This code would be used with real database tables:
      // const { error } = await supabase
      //   .from('news_interactions')
      //   .insert({
      //     news_id: news.id,
      //     user_id: user.id,
      //     comment: commentText.trim(),
      //   });
      //
      // if (error) throw error;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Share the article
  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.content.substring(0, 100) + "...",
        url: news.source_url,
      })
      .then(() => toast.success("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(news.source_url)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image column (1/3 width on md+ screens) */}
        <div className="relative h-48 md:h-full">
          <img 
            src={news.image_url || "https://via.placeholder.com/300x200?text=News"} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2" variant="secondary">
            {news.industry}
          </Badge>
        </div>
        
        {/* Content column (2/3 width on md+ screens) */}
        <div className="p-6 col-span-2 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{news.title}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-3">{news.content}</p>
            
            <div className="flex items-center text-xs text-muted-foreground mb-4">
              <Clock className="w-3 h-3 mr-1" />
              <span title={formattedDate}>{timeAgo}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Button 
              variant={liked ? "default" : "outline"} 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likesCount || ''}</span>
            </Button>
            
            <Button 
              variant={showComments ? "default" : "outline"} 
              size="sm" 
              className="flex items-center gap-1"
              onClick={toggleComments}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount || ''}</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={shareArticle}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 ml-auto"
              asChild
            >
              <a href={news.source_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span>Read More</span>
              </a>
            </Button>
          </div>
          
          {/* Comments section */}
          {showComments && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-2">Comments</h4>
              
              {/* Comment form */}
              {user && (
                <div className="flex gap-2 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.image_url || ''} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Add a comment..." 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-2 text-sm"
                      rows={2}
                    />
                    <Button 
                      size="sm" 
                      onClick={submitComment} 
                      disabled={isSubmitting || !commentText.trim()}
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Comment list */}
              {comments.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map((comment, index) => (
                    <div key={comment.id || index} className="flex gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm bg-muted p-2 rounded-md">{comment.comment}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-2">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
