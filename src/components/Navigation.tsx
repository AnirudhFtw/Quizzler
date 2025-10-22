import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

/**
 * Navigation Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Add authentication state management:
 *    - Track if user is logged in using Supabase session
 *    - Show/hide navigation items based on auth state
 * 
 * 2. Implement proper logout functionality:
 *    - Call supabase.auth.signOut() on Logout click
 *    - Clear any cached user data
 *    - Redirect to login page
 * 
 * 3. Add user profile display (optional):
 *    - Show username/avatar in navigation
 *    - Dropdown menu for profile, settings, logout
 * 
 * Example logout implementation:
 * 
 * const handleLogout = async () => {
 *   const { error } = await supabase.auth.signOut();
 *   if (!error) {
 *     window.location.href = '/';
 *   }
 * };
 */

const Navigation = () => {
  const location = useLocation();
  const isDarkPage = location.pathname === "/leaderboard" || location.pathname === "/profile";
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";
  const isAboutPage = location.pathname === "/about";
  
  // TODO: Add authentication state
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null);
  
  // TODO: Check authentication status on mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     setIsAuthenticated(!!session);
  //     setUser(session?.user || null);
  //   };
  //   checkAuth();
  // }, []);
  
  // TODO: Implement logout handler
  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   setIsAuthenticated(false);
  //   setUser(null);
  //   window.location.href = '/';
  // };
  
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
      ) : (
        <div className="hidden md:flex items-center space-x-8">
          <a href="/dashboard" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            Home
          </a>
          <a href="/" className={`transition-colors ${
            isDarkPage 
              ? "text-white hover:text-green-400" 
              : "text-foreground hover:text-sage"
          }`}>
            Logout
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navigation;