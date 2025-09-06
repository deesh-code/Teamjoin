// React router hook to get current URL location
import { useLocation } from "react-router-dom";

// React hook for side effects (like logging errors)
import { useEffect } from "react";

// NotFound component - shows when user visits a page that doesn't exist
function NotFound() {
  // Get the current URL location from React Router
  const location = useLocation();

  // Log the 404 error to console when component loads or URL changes
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    // Full screen container centered content using semantic design tokens
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Large 404 heading */}
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        
        {/* Error message */}
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        
        {/* Link back to home page using semantic colors */}
        <a 
          href="/" 
          className="text-primary hover:text-primary/80 underline transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}

// Export the component so other files can use it
export default NotFound;