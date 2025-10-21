import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">
              About Quizzler
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to Quizzler, your ultimate platform for creating, sharing, and taking quizzes. 
              Whether you're a student looking to test your knowledge or an educator creating engaging 
              assessments, Quizzler makes it simple and fun.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Create Quizzes</h3>
              <p className="text-muted-foreground">
                Design custom quizzes with multiple question types including MCQs, True/False, and Fill in the Blanks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Take Quizzes</h3>
              <p className="text-muted-foreground">
                Test your knowledge with quizzes from various topics and track your progress over time.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Compete</h3>
              <p className="text-muted-foreground">
                Join the leaderboard and compete with others to see who's the quiz champion.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Button
              onClick={() => window.location.href = '/'}
              className="h-12 px-8 bg-sage hover:bg-sage/90 text-white font-medium transition-colors"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
