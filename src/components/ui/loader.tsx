
import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4"
  };

  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      <div 
        className={cn(
          "animate-spin rounded-full border-b-primary",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Loader;
