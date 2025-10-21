import Navigation from "@/components/Navigation";
import { Mail, Phone, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-sage">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground text-sm break-all">
                anirudh23bcs209@iiitkottayam.ac.in
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground">
                +91 8097694903
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <Instagram className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Instagram</h3>
              <p className="text-muted-foreground">
                _ani1rud_
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Headquarters</h3>
              <p className="text-muted-foreground text-sm">
                IIIT Kottayam, Kerala, India
              </p>
            </div>
          </div>
        </div>

        <footer className="w-full max-w-5xl mx-auto mt-auto pt-20 pb-8 space-y-8">
          <div className="flex justify-center items-center gap-12 text-muted-foreground">
            <a href="/about" className="hover:text-sage transition-colors">
              About
            </a>
            <a href="/dashboard" className="hover:text-sage transition-colors">
              Pricing
            </a>
            <a href="/" className="hover:text-sage transition-colors">
              Get Started
            </a>
            <a href="/contact" className="hover:text-sage transition-colors">
              Contact
            </a>
          </div>

          <div className="flex justify-center items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-sage/10">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-sage/10">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-sage/10">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="hsl(var(--background))" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="hsl(var(--background))"/>
              </svg>
            </Button>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            © 2023 Quizzler. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Contact;
