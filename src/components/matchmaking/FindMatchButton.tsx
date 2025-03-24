
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import SkillsSelector from "./SkillsSelector";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FindMatchButtonProps extends ButtonProps {
  showIcon?: boolean;
  label?: string;
}

const FindMatchButton: React.FC<FindMatchButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  showIcon = false,
  label = "Find Matches",
  ...props
}) => {
  const [isSkillsSelectorOpen, setIsSkillsSelectorOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      toast.error("You need to sign in to find matches");
      navigate("/login");
      return;
    }
    
    setIsSkillsSelectorOpen(true);
  };

  const handleSubmit = (industry: string, skills: string[]) => {
    // Create URL parameters
    const params = new URLSearchParams();
    if (industry) params.append("industry", industry);
    if (skills.length > 0) params.append("skills", skills.join(","));
    
    // Navigate to matches page with filters
    navigate(`/matches?${params.toString()}`);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={handleClick}
        {...props}
      >
        {showIcon && <Search className="h-4 w-4" />}
        {label}
      </Button>
      
      <SkillsSelector
        isOpen={isSkillsSelectorOpen}
        onClose={() => setIsSkillsSelectorOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default FindMatchButton;
