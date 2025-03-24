
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface HeroProps {
  user: User | null;
  onGetStarted: () => void;
  onSignIn: () => void;
  onDashboard: () => void;
  actionButton?: React.ReactNode;
}

const Hero = ({ user, onGetStarted, onSignIn, onDashboard, actionButton }: HeroProps) => {
  return (
    <div className="relative isolate px-6 lg:px-8 py-24 sm:py-32">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Connect with Like-Minded Professionals
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Find and connect with professionals who share your interests, skills, and industry. Build meaningful professional relationships through smart matching.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {user ? (
            <>
              <Button onClick={onDashboard} size="lg" className="rounded-full">
                Go to Dashboard
              </Button>
              {actionButton}
            </>
          ) : (
            <>
              <Button onClick={onGetStarted} size="lg" className="rounded-full">
                Get Started
              </Button>
              <Button onClick={onSignIn} variant="ghost" size="lg">
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-200 to-indigo-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
};

export default Hero;
