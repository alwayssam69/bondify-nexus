
import React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const OnboardingProgress = ({
  steps,
  currentStep,
  onStepClick,
}: OnboardingProgressProps) => {
  return (
    <div className="hidden sm:flex items-center justify-center w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <React.Fragment key={step}>
            <div className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick && isCompleted && onStepClick(index)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  isCompleted 
                    ? "bg-primary text-primary-foreground cursor-pointer" 
                    : isCurrent 
                      ? "bg-primary/20 text-primary border-2 border-primary" 
                      : "bg-muted text-muted-foreground"
                )}
                disabled={!isCompleted && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <span 
                className={cn(
                  "absolute -bottom-6 text-xs whitespace-nowrap",
                  isCurrent ? "font-medium text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-0.5 w-16 mx-1",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OnboardingProgress;
