import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  
  const isDarkPage = location.pathname === "/leaderboard" || location.pathname === "/profile";
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";
  const isAboutPage = location.pathname === "/about";
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };
  
  return (
    <nav className={`w-full px-6 py-4 flex items-center justify-between backdrop-blur-sm border-b ${
      isDarkPage 
        ? "bg-slate-900/95 border-slate-700/50" 
        : "bg-background/95 border-border/20"
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 rounded-sm flex items-center justify-center ${
          isDarkPage ? "bg-white" : "bg-primary"
        }`}>
          <div className={`w-3 h-3 rounded-sm ${
            isDarkPage ? "bg-slate-900" : "bg-background"
          }`}></div>
        </div>
        <span className={`text-xl font-semibold ${
          isDarkPage ? "text-white" : "text-foreground"
        }`}>Quizzler</span>
      </div>
      
      {isAboutPage ? (
        <div className="hidden md:flex items-center space-x-8">
          <a href="/contact" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            Contact
          </a>
        </div>
      ) : isAuthPage ? (
        <div className="hidden md:flex items-center space-x-8">
          <a href="/about" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            About
          </a>
          <a href="/contact" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            Contact
          </a>
        </div>
      ) : isAuthenticated ? (
        <div className="hidden md:flex items-center space-x-8">
          <a href="/dashboard" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            Home
          </a>
          <a href="/profile" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            My Profile
          </a>
          <span className={`text-sm ${
            isDarkPage ? "text-white/70" : "text-muted-foreground"
          }`}>
            Hi, {user?.name}
          </span>
          <button 
            onClick={handleLogout}
            className={`transition-colors ${
              isDarkPage 
                ? "text-white hover:text-green-400" 
                : "text-foreground hover:text-sage"
            }`}
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navigation;