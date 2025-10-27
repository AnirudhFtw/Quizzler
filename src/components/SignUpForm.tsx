import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailVerification from "@/components/EmailVerification";

import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      await signUp(email, password, fullName);
      toast.success("Account created successfully! Please check your email for verification.");
      setShowEmailVerification(true);
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show email verification screen after successful signup
  if (showEmailVerification) {
    return <EmailVerification email={email} />;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create your Account
        </h1>
        <p className="text-gray-800 font-semibold">
          Join our community and start your learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="sr-only">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 px-4 border-gray-300 bg-gray-50 text-theme-navy placeholder:text-gray-500 rounded-lg focus:border-theme-emerald focus:ring-theme-emerald/20 focus:bg-white transition-all duration-200"
            required
          />
        </div>

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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 px-4 border-gray-300 bg-gray-50 text-theme-navy placeholder:text-gray-500 rounded-lg focus:border-theme-emerald focus:ring-theme-emerald/20 focus:bg-white transition-all duration-200"
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-theme-emerald hover:bg-theme-emerald-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <div className="text-center">
          <p className="text-gray-800 font-semibold">
            Already have an account?{" "}
            <a
              href="/"
              className="text-theme-emerald hover:text-theme-emerald-dark font-bold underline transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
