import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-background border-b border-border">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-background rounded-sm"></div>
        </div>
        <span className="text-xl font-semibold text-foreground">Quizzler</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="/dashboard" className="text-foreground hover:text-sage transition-colors">
          Home
        </a>
        <Button variant="outline" asChild>
          <a href="/">Logout</a>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;