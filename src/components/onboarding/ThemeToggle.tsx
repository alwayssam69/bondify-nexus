
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={theme === "dark" ? "outline" : "ghost"}
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`rounded-full w-9 h-9 hover:scale-110 transition-transform ${
        theme === "dark" 
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
          : "hover:bg-gray-100"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-blue-700 transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;
