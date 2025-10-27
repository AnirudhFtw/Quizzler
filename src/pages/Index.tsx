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
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] px-6 py-12">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Illustration Section */}
          <div className="flex items-center justify-center lg:justify-start">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-theme-emerald/10 to-blue-50 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src={studyIllustration}
                  alt="People collaborating and studying together"
                  className="w-full h-full object-contain p-8"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-theme-emerald/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl"></div>
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
      <footer className="w-full py-8 px-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-theme-navy font-semibold">
              &copy; 2025 Quizzler
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              Made with <span className="text-theme-emerald">❤️</span> for @{userIp || 'Loading...'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
