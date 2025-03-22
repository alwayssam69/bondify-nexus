
import React, { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OnboardingStepProps {
  isActive: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const OnboardingStep = ({
  isActive,
  title,
  description,
  icon,
  children,
  className,
}: OnboardingStepProps) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("w-full space-y-6", className)}
        >
          <div className="space-y-2">
            {icon && (
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="mt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingStep;
