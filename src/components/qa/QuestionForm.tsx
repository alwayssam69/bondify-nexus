
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X } from "lucide-react";

interface QuestionFormProps {
  onClose: () => void;
  onSubmit: (title: string, body: string, tags: string[]) => void;
  isAnonymous: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onClose, onSubmit, isAnonymous }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    } else if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!body.trim()) {
      toast.error("Please enter question details");
      return;
    }
    
    setIsSubmitting(true);
    onSubmit(title, body, tags);
    
    // Reset form
    setTitle("");
    setBody("");
    setTags([]);
    setTagInput("");
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/100
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Details</Label>
            <Textarea
              id="body"
              placeholder="Provide more details about your question..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {body.length}/1000
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="bg-muted text-sm px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                id="tags"
                placeholder="Add tags (e.g., career, technology)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="ml-2"
                onClick={addTag}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a tag. Max 5 tags.
            </p>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Posting as: {isAnonymous ? "Anonymous" : "Public"}</p>
            <p className="text-muted-foreground text-xs">
              {isAnonymous 
                ? "Your identity will be hidden from other users." 
                : "Your name will be visible to other users."}
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim() || !body.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;
