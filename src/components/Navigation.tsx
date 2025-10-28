import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    <nav className="w-full px-4 sm:px-6 py-4 backdrop-blur-sm border-b bg-theme-navy/95 border-theme-navy/30 shadow-lg relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-theme-emerald to-theme-emerald-dark flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 rounded bg-white/90"></div>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Quizzler</span>
        </div>
        
        {/* Desktop Navigation */}
        {isAboutPage ? (
          <div className="hidden md:flex items-center space-x-8">
            <a href="/contact" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium">
              Contact
            </a>
          </div>
        ) : isAuthPage ? (
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium cursor-pointer"
            >
              About
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium cursor-pointer"
            >
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
              <span className="hidden lg:block text-sm text-white/70 font-medium">
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

        {/* Mobile Menu Button */}
        {(isAboutPage || isAuthPage || isAuthenticated) && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-theme-emerald transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-theme-navy/95 backdrop-blur-sm border-b border-theme-navy/30 shadow-lg z-50">
          <div className="px-4 py-4 space-y-4">
            {isAboutPage ? (
              <a 
                href="/contact" 
                className="block text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            ) : isAuthPage ? (
              <>
                <a 
                  href="#about" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium cursor-pointer py-2"
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium cursor-pointer py-2"
                >
                  Contact
                </a>
              </>
            ) : isAuthenticated ? (
              <>
                <a 
                  href="/dashboard" 
                  className="block text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/profile" 
                  className="block text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </a>
                <div className="border-t border-white/20 pt-4 mt-4">
                  <p className="text-sm text-white/70 font-medium mb-3">
                    Hi, {user?.name}
                  </p>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-white bg-theme-emerald hover:bg-theme-emerald-dark rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;