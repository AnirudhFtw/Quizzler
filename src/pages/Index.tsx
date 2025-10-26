import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import LoginForm from "@/components/LoginForm";
import studyIllustration from "@/assets/study-illustration.png";

const Index = () => {
  const [userIp, setUserIp] = useState<string>("");

  useEffect(() => {
    // Get user's IP address
    const getUserIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setUserIp('Unknown');
      }
    };

    getUserIp();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] px-6 py-12">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Illustration Section */}
          <div className="flex items-center justify-center lg:justify-start">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-warm-beige rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={studyIllustration}
                  alt="People collaborating and studying together"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 bg-muted/30 border-t border-border/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 <span className="font-semibold text-foreground">@Quizzler</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <span className="text-red-500">❤️</span> for @{userIp || 'Loading...'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
