
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw,
  Loader2,
  Bell,
  MessageSquare,
  Video
} from "lucide-react";
import FindMatchButton from "@/components/matchmaking/FindMatchButton";
import ThemeToggle from "@/components/onboarding/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/header/notifications/useNotifications";

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
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mt-8 mb-6">
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
        <FindMatchButton 
          size="sm" 
          variant="default" 
          className="h-9" 
          showIcon={true}
          label="Find Professionals"
        />
        
        <Button 
          variant="outline"
          size="sm"
          className="h-9 relative"
          onClick={() => navigate('/chat')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="h-9 relative"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
        
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
        <ThemeToggle />
      </div>
    </div>
  );
};

export default DashboardHeader;
