// ==================== INPUT COMPONENT ====================
// This is a text input field that users can type into
// It can handle different types like text, email, password, etc.

import * as React from "react"
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== INPUT FIELD ====================
// A flexible input component that can be used for forms
// Example usage: <Input type="email" placeholder="Enter your email" />
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type} // Can be "text", "email", "password", "number", etc.
        className={cn(
          // Base input styles using semantic design tokens
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background " +
          // File input specific styles (when type="file")
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground " +
          // Placeholder text styling
          "placeholder:text-muted-foreground " +
          // Focus styles - what happens when user clicks/focuses on input
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
          // Disabled state - when input is not interactive
          "disabled:cursor-not-allowed disabled:opacity-50 " +
          // Responsive text size - smaller on medium screens and up
          "md:text-sm",
          className // Allow custom styles to be added
        )}
        ref={ref} // For advanced React patterns
        {...props} // Pass through all other props (value, onChange, placeholder, etc.)
      />
    )
  }
)

// Set display name for debugging tools
Input.displayName = "Input"

// ==================== EXAMPLE USAGE ====================
// <Input 
//   type="text" 
//   placeholder="Enter your name"
//   value={name}
//   onChange={(e) => setName(e.target.value)}
// />

export { Input }