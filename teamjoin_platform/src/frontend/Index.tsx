
// React lets us build components using JSX
import React from "react";
import { NavLink } from "react-router-dom";

// Import our UI components
import { Button } from "@/components/ui/button";
import { Users, Lightbulb, Search } from "lucide-react";

// This is our main home page component
function Index() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Welcome to TeamJoin</h1>
        <p className="text-xl text-muted-foreground mb-8">The best place to find teammates and build amazing projects.</p>
        <Button asChild size="lg">
          <NavLink to="/discover">Get Started</NavLink>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg">
              <Search className="h-12 w-12 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-semibold mb-2">Discover Ideas</h3>
              <p className="text-muted-foreground">Browse a feed of exciting project ideas from other users.</p>
            </div>
            <div className="p-6 rounded-lg">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-semibold mb-2">Share Your Own</h3>
              <p className="text-muted-foreground">Have an idea? Share it with the community and find collaborators.</p>
            </div>
            <div className="p-6 rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-semibold mb-2">Build Your Team</h3>
              <p className="text-muted-foreground">Connect with talented individuals and build your dream team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; 2025 TeamJoin. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <NavLink to="/about" className="hover:text-foreground">About</NavLink>
          <NavLink to="/contact" className="hover:text-foreground">Contact</NavLink>
          <NavLink to="/terms" className="hover:text-foreground">Terms of Service</NavLink>
        </div>
      </footer>
    </div>
  );
}

export default Index;
