
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserCheck, MessageSquare, Heart, Bell, CalendarCheck, Flag } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "match",
    title: "New Match!",
    message: "You and Taylor Martinez are now matched!",
    time: "2 hours ago",
    user: {
      name: "Taylor Martinez",
      image: ""
    },
    read: false
  },
  {
    id: 2,
    type: "message",
    title: "New Message",
    message: "Alex Johnson sent you a new message",
    time: "5 hours ago",
    user: {
      name: "Alex Johnson",
      image: ""
    },
    read: false
  },
  {
    id: 3,
    type: "like",
    title: "Profile Like",
    message: "Jamie Lee liked your profile",
    time: "Yesterday",
    user: {
      name: "Jamie Lee",
      image: ""
    },
    read: true
  },
  {
    id: 4,
    type: "system",
    title: "Account Verification",
    message: "Your account has been successfully verified",
    time: "2 days ago",
    read: true
  },
  {
    id: 5,
    type: "event",
    title: "Networking Event",
    message: "Don't forget about the networking event tomorrow",
    time: "2 days ago",
    read: true
  }
];

const NotificationCenter = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="ghost" size="sm">Mark all as read</Button>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`p-4 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}>
                <div className="flex gap-4">
                  {notification.user ? (
                    <Avatar>
                      <AvatarImage src={notification.user.image} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                      {notification.type === 'system' && <Bell className="h-5 w-5 text-primary" />}
                      {notification.type === 'event' && <CalendarCheck className="h-5 w-5 text-primary" />}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    
                    {notification.type === 'match' && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    )}
                    
                    {notification.type === 'message' && (
                      <Button variant="outline" size="sm" className="mt-2">
                        View Message
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.read).map((notification) => (
              <Card key={notification.id} className="p-4 bg-muted/20">
                <div className="flex gap-4">
                  {notification.user ? (
                    <Avatar>
                      <AvatarImage src={notification.user.image} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>
              </Card>
            ))}
            
            {notifications.filter(n => !n.read).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No unread notifications</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-4">
            {notifications.filter(n => n.type === 'match').map((notification) => (
              <Card key={notification.id} className={`p-4 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={notification.user?.image} alt={notification.user?.name} />
                    <AvatarFallback>{notification.user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    
                    <Button variant="outline" size="sm" className="mt-2">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {notifications.filter(n => n.type === 'match').length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No match notifications</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            {notifications.filter(n => n.type === 'message').map((notification) => (
              <Card key={notification.id} className={`p-4 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={notification.user?.image} alt={notification.user?.name} />
                    <AvatarFallback>{notification.user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    
                    <Button variant="outline" size="sm" className="mt-2">
                      View Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {notifications.filter(n => n.type === 'message').length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No message notifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationCenter;
