import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Login attempt:", { email, password });
    // Redirect to dashboard after login
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
            <button
              type="button"
              className="text-sage hover:text-sage/80 font-medium underline transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;