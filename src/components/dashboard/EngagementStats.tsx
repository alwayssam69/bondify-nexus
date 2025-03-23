
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  Eye,
  ActivitySquare,
  Send,
  MessagesSquare,
  BarChart4
} from "lucide-react";

interface EngagementStatsProps {
  stats: {
    activeMatches: number;
    connectionsTotal: number;
    ongoingChats: number;
    profileViews: number;
    messagesSent: number;
    messagesReceived: number;
    responseRate: number;
  };
  className?: string;
}

const EngagementStats = ({ stats, className }: EngagementStatsProps) => {
  const statItems = [
    {
      title: "Active Matches",
      value: stats.activeMatches || 0,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      description: "Recently connected"
    },
    {
      title: "Total Connections",
      value: stats.connectionsTotal || 0,
      icon: <ActivitySquare className="h-4 w-4 text-green-500" />,
      description: "Successful matches"
    },
    {
      title: "Ongoing Chats",
      value: stats.ongoingChats || 0,
      icon: <MessageSquare className="h-4 w-4 text-violet-500" />,
      description: "Active conversations"
    },
    {
      title: "Profile Views",
      value: stats.profileViews || 0,
      icon: <Eye className="h-4 w-4 text-amber-500" />,
      description: "Who viewed you"
    },
    {
      title: "Messages Sent",
      value: stats.messagesSent || 0,
      icon: <Send className="h-4 w-4 text-sky-500" />,
      description: "Outgoing"
    },
    {
      title: "Messages Received",
      value: stats.messagesReceived || 0,
      icon: <MessagesSquare className="h-4 w-4 text-pink-500" />,
      description: "Incoming"
    },
    {
      title: "Response Rate",
      value: stats.responseRate !== undefined ? `${stats.responseRate || 0}%` : '0%',
      icon: <BarChart4 className="h-4 w-4 text-indigo-500" />,
      description: "Reply efficiency"
    }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Engagement Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementStats;
