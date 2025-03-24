
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import MatchFilterModal from "./MatchFilterModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FindMatchButtonProps {
  size?: "default" | "lg" | "sm";
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  showIcon?: boolean;
  label?: string;
}

const FindMatchButton: React.FC<FindMatchButtonProps> = ({
  size = "lg",
  variant = "default",
  className = "",
  showIcon = true,
  label = "Find a Match",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      toast.info("Please sign in to find matches", {
        description: "Create an account or sign in to connect with professionals",
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }
    
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`group relative overflow-hidden transition-all duration-300 ${
          variant === "default"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            : ""
        } ${className}`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {showIcon && <Search className="h-5 w-5" />}
          {label}
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Button>

      <MatchFilterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default FindMatchButton;
