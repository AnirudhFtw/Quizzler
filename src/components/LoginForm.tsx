import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success("Successfully logged in!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome to Quizzler
        </h1>
        <p className="text-sm sm:text-base text-gray-800 font-semibold">
          Sign in to continue your learning journey
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
            className="h-12 px-4 border-gray-300 bg-gray-50 text-theme-navy placeholder:text-gray-500 rounded-lg focus:border-theme-emerald focus:ring-theme-emerald/20 focus:bg-white transition-all duration-200"
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
            className="h-12 px-4 border-gray-300 bg-gray-50 text-theme-navy placeholder:text-gray-500 rounded-lg focus:border-theme-emerald focus:ring-theme-emerald/20 focus:bg-white transition-all duration-200"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-theme-emerald hover:bg-theme-emerald-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <div className="text-center">
          <p className="text-gray-800 font-semibold">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-theme-emerald hover:text-theme-emerald-dark font-bold underline transition-colors"
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