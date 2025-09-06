// ==================== BUTTON COMPONENT ====================
// This is our main button component that can be used throughout the app
// It has different styles (variants) and sizes that you can choose from

import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Allows button to act as different HTML elements
import { cva } from "class-variance-authority" // Helps manage different button styles

import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== BUTTON STYLES ====================
// This defines all the different looks our button can have
// We use semantic design tokens (like bg-primary) instead of direct colors
const buttonVariants = cva(
  // Base styles that ALL buttons will have
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    // Different button styles (variants)
    variants: {
      variant: {
        // Primary button - main action button (blue/brand color)
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        
        // Destructive button - for dangerous actions (red)
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        // Outline button - has border but transparent background
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        
        // Secondary button - less prominent than primary
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Ghost button - very subtle, almost invisible
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Link button - looks like a text link
        link: "text-primary underline-offset-4 hover:underline",
      },
      
      // Different button sizes
      size: {
        default: "h-10 px-4 py-2", // Normal size
        sm: "h-9 rounded-md px-3",  // Small size
        lg: "h-11 rounded-md px-8", // Large size
        icon: "h-10 w-10",          // Square button for icons
      },
    },
    
    // Default styles if no variant/size is specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ==================== BUTTON COMPONENT ====================
// This is the actual Button component that you use in your app
// Example usage: <Button variant="primary" size="lg">Click me</Button>
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, the button will act as whatever child element you pass
    // Otherwise, it's a regular HTML button
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        // Combine the variant styles with any custom className
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props} // Pass through all other props (onClick, disabled, etc.)
      />
    )
  }
)

// Set display name for debugging tools
Button.displayName = "Button"

// Export the button component and its style variants
export { Button, buttonVariants }