import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const location = useLocation();
  const menuItems = [
    { label: "Home", path: "/", available: true },
    { label: "Dashboard", path: "/dashboard", available: isLoggedIn },
    { label: "Matches", path: "/matches", available: isLoggedIn },
    { label: "Discover", path: "/discover", available: isLoggedIn },
    { label: "Messages", path: "/chat", available: isLoggedIn },
    { label: "Community", path: "/community", available: isLoggedIn },
    { label: "Find People", path: "/search", available: isLoggedIn },
    { label: "News", path: "/news", available: true },
    { label: "About", path: "/about", available: true },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {menuItems.map((item) =>
        item.available ? (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive
                  ? "text-primary underline underline-offset-4"
                  : "text-muted-foreground"
              )
            }
          >
            {item.label}
          </NavLink>
        ) : null
      )}
    </nav>
  );
};

export default Navigation;
