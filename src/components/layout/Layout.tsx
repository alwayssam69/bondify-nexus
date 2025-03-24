
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const Layout = ({ children, className, hideHeader = false, hideFooter = false }: LayoutProps) => {
  // Safely access auth context
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth context not available yet in Layout component:", error);
  }
  
  const location = useLocation();
  
  // This is the key fix - we're detecting if we're on a page that already has a header
  // to prevent duplicate navigation elements
  const hasExternalHeader = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        {!hideHeader && !hasExternalHeader && (
          <div className="z-40 sticky top-0">
            <Header />
          </div>
        )}
        <main className={cn("flex-1 pt-2", className)}>
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
