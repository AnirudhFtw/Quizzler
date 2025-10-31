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
    <nav className="navbar-container">
      <div className="navbar-content">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-theme-emerald to-theme-emerald-dark flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 rounded bg-white/90"></div>
          </div>
          <span className="text-xl font-bold text-white tracking-tight flex items-center h-10">Quizzler</span>
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
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a href="/dashboard" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium flex items-center h-10">
              Home
            </a>
            <a href="/profile" className="text-white/80 hover:text-theme-emerald transition-all duration-200 font-medium flex items-center h-10">
              My Profile
            </a>
            <div className="flex items-center space-x-3 pl-3 md:pl-4 border-l border-white/20">
              <span className="hidden lg:flex items-center text-sm text-white/70 font-medium truncate max-w-[120px] xl:max-w-[160px] h-10">
                Hi, {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-white bg-theme-emerald hover:bg-theme-emerald-dark rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap h-10 flex items-center"
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
            className="hamburger-button"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {isAboutPage ? (
              <a 
                href="/contact" 
                className="mobile-menu-item"
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
                  className="mobile-menu-item cursor-pointer"
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
                  className="mobile-menu-item cursor-pointer"
                >
                  Contact
                </a>
              </>
            ) : isAuthenticated ? (
              <>
                <a 
                  href="/dashboard" 
                  className="mobile-menu-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/profile" 
                  className="mobile-menu-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </a>
                <div className="mobile-menu-divider">
                  <p className="mobile-menu-user">
                    Hi, {user?.name}
                  </p>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-menu-button"
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