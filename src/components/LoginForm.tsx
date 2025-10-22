import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * LoginForm Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Import Supabase client: import { supabase } from "@/integrations/supabase/client"
 * 2. Add state for loading and error handling
 * 3. Implement signInWithPassword in handleSubmit
 * 4. Add error toast notifications for failed login attempts
 * 5. Redirect authenticated users automatically using useEffect + supabase.auth.getSession()
 */

const LoginForm = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // TODO: Add loading state for better UX
  // const [loading, setLoading] = useState(false);
  
  // TODO: Add error state to display authentication errors
  // const [error, setError] = useState<string | null>(null);

  /**
   * Handle login form submission
   * 
   * BACKEND TODO:
   * 1. Call supabase.auth.signInWithPassword({ email, password })
   * 2. Handle errors (wrong credentials, network issues, etc.)
   * 3. On success, redirect to /dashboard
   * 4. Store session automatically (Supabase handles this)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with actual Supabase authentication
    // setLoading(true);
    // setError(null);
    
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    
    // if (error) {
    //   setError(error.message);
    //   setLoading(false);
    //   return;
    // }
    
    // Success - Supabase automatically stores the session
    console.log("Login attempt:", { email, password });
    window.location.href = '/dashboard';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to Quizzler
        </h1>
        <p className="text-muted-foreground">
          Join our community. Sign up or log in to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 px-4 border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 px-4 border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-sage hover:bg-sage/90 text-white font-medium transition-colors"
        >
          Sign In
        </Button>

        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-sage hover:text-sage/80 font-medium underline transition-colors"
            >
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;