// ==================== BADGE COMPONENTS ====================
// Badges are small labels used to show status, categories, or counts
// Perfect for tags, notifications, or highlighting information

import * as React from "react"
import { cva } from "class-variance-authority" // Helps manage different badge styles
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== BADGE STYLES ====================
// This defines all the different looks our badge can have
// We use semantic design tokens instead of direct colors
const badgeVariants = cva(
  // Base styles that ALL badges will have
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    // Different badge styles (variants)
    variants: {
      variant: {
        // Default badge - uses primary brand colors
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        
        // Secondary badge - more subtle than default
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Destructive badge - for warnings or errors (red)
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        
        // Outline badge - has border but transparent background
        outline: "text-foreground",
      },
    },
    // Default style if no variant is specified
    defaultVariants: {
      variant: "default",
    },
  }
)

// ==================== BADGE COMPONENT ====================
// The actual Badge component that you use in your app
// Example usage: <Badge variant="secondary">New</Badge>
function Badge({ className, variant, ...props }) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      {...props} // Pass through all other props (onClick, children, etc.)
    />
  )
}

// ==================== EXAMPLE USAGE ====================
// <Badge>Default Badge</Badge>
// <Badge variant="secondary">Secondary</Badge>
// <Badge variant="destructive">Error</Badge>
// <Badge variant="outline">Outline</Badge>

export { Badge, badgeVariants }