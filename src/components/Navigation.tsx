import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const isDarkPage = location.pathname === "/leaderboard" || location.pathname === "/profile";
  
  return (
    <nav className={`w-full px-6 py-4 flex items-center justify-between backdrop-blur-sm border-b ${
      isDarkPage 
        ? "bg-slate-900/95 border-slate-700/50" 
        : "bg-background/95 border-border/20"
    }`}>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-background rounded-sm"></div>
        </div>
        <span className="text-xl font-semibold text-foreground">Quizzler</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="/dashboard" className="text-foreground hover:text-sage transition-colors">
          Home
        </a>
        <a href="/" className="text-foreground hover:text-sage transition-colors">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default Navigation;