
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  // Safely access auth context
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth context not available yet in Layout component:", error);
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1">
          {/* LeftSidebar component removed as requested */}
          {/* Add padding top to account for fixed header but reduce it */}
          <main className={cn("flex-1 pt-12", className)}>
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
