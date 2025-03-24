
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw,
  Loader2,
  Bell,
  Search,
  Settings,
  User,
  Sun,
  Moon
} from "lucide-react";
import FindMatchButton from "@/components/matchmaking/FindMatchButton";

interface DashboardHeaderProps {
  user: any;
  newMatchesCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardHeader = ({ 
  user, 
  newMatchesCount,
  onRefresh,
  isLoading
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || "Professional"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {newMatchesCount > 0 
            ? `You have ${newMatchesCount} new matches today` 
            : "Find and connect with professionals that match your networking goals"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <FindMatchButton size="sm" variant="default" className="h-9" />
        <Button 
          onClick={onRefresh} 
          variant="outline"
          size="sm"
          className="h-9"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
