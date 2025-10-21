import Navigation from "@/components/Navigation";
import SignUpForm from "@/components/SignUpForm";
import studyIllustration from "@/assets/study-illustration.png";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
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

          {/* Sign Up Form Section */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <SignUpForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
