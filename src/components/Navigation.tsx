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
    <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-sm border-b bg-theme-navy/95 border-theme-navy/30 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-theme-emerald to-theme-emerald-dark flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 rounded bg-white/90"></div>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Quizzler</span>
      </div>
      
      {isAboutPage ? (
        <div className="hidden md:flex items-center space-x-8">
          <a href="/contact" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium">
            Contact
          </a>
        </div>
      ) : isAuthPage ? (
        <div className="hidden md:flex items-center space-x-8">
          <a href="/about" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium">
            About
          </a>
          <a href="/contact" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium">
            Contact
          </a>
        </div>
      ) : isAuthenticated ? (
        <div className="hidden md:flex items-center space-x-6">
          <a href="/dashboard" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium">
            Home
          </a>
          <a href="/profile" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium">
            My Profile
          </a>
          <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
            <span className="text-sm text-white/70 font-medium">
              Hi, {user?.name}
            </span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-theme-emerald hover:bg-theme-emerald-dark rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navigation;