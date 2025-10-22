import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * SignUpForm Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Create 'profiles' table in Supabase with columns:
 *    - id (uuid, references auth.users)
 *    - username (text, unique)
 *    - full_name (text)
 *    - gender (text)
 *    - date_of_birth (date)
 *    - location (text)
 *    - created_at (timestamp)
 * 
 * 2. Enable RLS (Row Level Security) on profiles table
 * 3. Create policy: Users can read their own profile
 * 4. Create policy: Users can update their own profile
 * 
 * 5. Create a database trigger to auto-create profile on signup:
 *    - Trigger function on auth.users INSERT
 *    - Auto-populate profiles table with user metadata
 * 
 * 6. In this component:
 *    - Import Supabase client
 *    - Call supabase.auth.signUp() with email, password, and user metadata
 *    - Handle email confirmation if enabled
 *    - Show success/error messages with toast notifications
 */

const SignUpForm = () => {
  // Form state - these will be sent to Supabase
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  
  // TODO: Add loading and error states
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  /**
   * Handle signup form submission
   * 
   * BACKEND TODO:
   * 1. Call supabase.auth.signUp() with user data
   * 2. Pass additional fields in options.data (user metadata)
   * 3. Handle email confirmation flow if enabled
   * 4. Show appropriate success/error messages
   * 5. Redirect to dashboard or show "check your email" message
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with actual Supabase signup
    // setLoading(true);
    // setError(null);
    
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     emailRedirectTo: `${window.location.origin}/dashboard`,
    //     data: {
    //       username,
    //       full_name: fullName,
    //       gender,
    //       date_of_birth: dob,
    //       location,
    //     }
    //   }
    // });
    
    // if (error) {
    //   setError(error.message);
    //   setLoading(false);
    //   return;
    // }
    
    // Success - user created and profile auto-populated by trigger
    console.log("Sign up attempt:", { username, fullName, email, gender, dob, location });
    window.location.href = '/dashboard';
  };

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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="sr-only">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 px-4 border-border bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender" className="sr-only">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger className="h-12 px-4 border-border bg-background text-foreground">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="sr-only">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="h-12 px-4 border-border bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="sr-only">
            City / Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="City / Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
          Sign Up
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
