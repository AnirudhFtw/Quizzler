import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

interface EmailVerificationProps {
  email: string;
}

const EmailVerification = ({ email }: EmailVerificationProps) => {
  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/10 to-soft-green/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Check Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a verification link to
            </p>
            <p className="font-medium text-foreground mt-1">
              {email}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Check your inbox</p>
                <p className="text-sm text-muted-foreground">
                  Click the verification link in the email we just sent you
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Check spam folder</p>
                <p className="text-sm text-muted-foreground">
                  Sometimes emails end up in spam or junk folders
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Sign in after verification</p>
                <p className="text-sm text-muted-foreground">
                  Once verified, you can sign in with your credentials
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGoToSignIn}
            className="w-full bg-sage hover:bg-sage/90 text-white"
          >
            Go to Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Didn't receive the email?</strong> Check your spam folder or try signing up again with the correct email address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
