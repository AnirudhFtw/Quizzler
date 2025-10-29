import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import LoginForm from "@/components/LoginForm";
import studyIllustration from "@/assets/study-illustration.png";
import { Mail, Phone, Instagram, MapPin, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [userIp, setUserIp] = useState<string>("");
  const navigate = useNavigate();

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
    <div className="bg-white mobile-viewport">
      <Navigation />
      
      <main className="flex items-center justify-center h-screen px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Illustration Section */}
          <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-theme-emerald/10 to-blue-50 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src={studyIllustration}
                  alt="People collaborating and studying together"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-theme-emerald/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 bg-blue-200/40 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      {/* Live Quiz Section */}
      <section className="w-full py-12 px-4 sm:px-6 bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
              <Gamepad2 className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Join Live Quiz
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Have a room code? Jump into a live quiz session and compete with other players in real-time!
            </p>
            <Button 
              onClick={() => navigate('/join-live-quiz')}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-medium"
            >
              Join Live Quiz
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen w-full py-16 sm:py-20 px-4 sm:px-6 bg-gray-50/80 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              About Quizzler
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              Welcome to Quizzler, your ultimate platform for creating, sharing, and taking quizzes. 
              Whether you're a student looking to test your knowledge or an educator creating engaging 
              assessments, Quizzler makes it simple and fun.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-theme-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Create Quizzes</h3>
              <p className="text-gray-600">
                Design custom quizzes with multiple question types including MCQs, True/False, and Fill in the Blanks.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-theme-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Take Quizzes</h3>
              <p className="text-gray-600">
                Test your knowledge with quizzes from various topics and track your progress over time.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-theme-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Compete</h3>
              <p className="text-gray-600">
                Join the leaderboard and compete with others to see who's the quiz champion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen w-full py-16 sm:py-20 px-4 sm:px-6 bg-white flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Contact Us
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-theme-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Email</h3>
              <p className="text-gray-600 text-sm text-center break-all">
                support@quizzler.com
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8 text-theme-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Phone</h3>
              <p className="text-gray-600 text-center">
                +91 6767123456
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <Instagram className="w-8 h-8 text-theme-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Instagram</h3>
              <p className="text-gray-600 text-center">
                Quizzler_Official
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-theme-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Headquarters</h3>
              <p className="text-gray-600 text-sm text-center">
                IIIT Kottayam, Kerala, India
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button variant="outline" size="icon" className="rounded-full hover:bg-theme-emerald/10 hover:border-theme-emerald">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full hover:bg-theme-emerald/10 hover:border-theme-emerald">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full hover:bg-theme-emerald/10 hover:border-theme-emerald">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
            </Button>
          </div>
        </div>
      </section>

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
