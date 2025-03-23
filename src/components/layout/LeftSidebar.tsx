
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Home, Users, MessageCircle, HelpCircle, Newspaper, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  let user = null;
  let signOut = async () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    signOut = auth.signOut;
  } catch (error) {
    console.log("Auth context not available in LeftSidebar:", error);
  }
  
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Matches", path: "/matches", icon: Users },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Q&A", path: "/qa-forum", icon: HelpCircle },
    { name: "News", path: "/news-insights", icon: Newspaper },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      console.log("Signing out from LeftSidebar...");
      toast({
        title: "Signing out...",
        description: "Please wait"
      });
      await signOut();
      // No need for the redirect here as it's now handled in the AuthContext
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <img 
          src="/placeholder.svg" 
          alt="Logo" 
          className="h-8 w-auto" 
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.name}>
              <SidebarMenuButton 
                isActive={isActive(link.path)}
                tooltip={link.name}
                onClick={() => handleNavClick(link.path)}
              >
                <link.icon className="mr-2 h-5 w-5" />
                <span>{link.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => handleNavClick("/profile")}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default LeftSidebar;
