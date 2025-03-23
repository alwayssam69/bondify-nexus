
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import LeftSidebar from "./LeftSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1">
          {isAuthenticated && <LeftSidebar />}
          {/* Add padding top to account for fixed header */}
          <main className={cn("flex-1 pt-20", className)}>
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
