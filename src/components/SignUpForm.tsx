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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create your Account
        </h1>
        <p className="text-muted-foreground">
          Let's get started on your quizzing journey!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="h-12 px-4 border-border bg-background text-foreground placeholder:text-muted-foreground"
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 px-4 border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-sage hover:bg-sage/90 text-white font-medium transition-colors"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/"
              className="text-sage hover:text-sage/80 font-medium underline transition-colors"
            >
              Log In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
