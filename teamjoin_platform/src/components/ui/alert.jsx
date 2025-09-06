// ==================== ALERT COMPONENTS ====================
// Alerts display important messages to users
// Perfect for notifications, warnings, errors, or success messages

import * as React from "react"
import { cva } from "class-variance-authority" // Helps manage different alert styles
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== ALERT STYLES ====================
// This defines all the different looks our alert can have
// We use semantic design tokens instead of direct colors
const alertVariants = cva(
  // Base styles that ALL alerts will have
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    // Different alert styles (variants)
    variants: {
      variant: {
        // Default alert - neutral information
        default: "bg-background text-foreground",
        
        // Destructive alert - for errors or warnings (red theme)
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    // Default style if no variant is specified
    defaultVariants: {
      variant: "default",
    },
  }
)

// ==================== MAIN ALERT CONTAINER ====================
// The outer container that wraps all alert content
// Has proper ARIA role for screen readers
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert" // Tells screen readers this is important information
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

// ==================== ALERT TITLE ====================
// The heading/title of the alert message
// Uses consistent font styling
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-medium leading-none tracking-tight", // Bold title with spacing
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

// ==================== ALERT DESCRIPTION ====================
// The main content/message of the alert
// Uses readable text styling
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm [&_p]:leading-relaxed", // Readable text size and line height
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// ==================== EXAMPLE USAGE ====================
// <Alert>
//   <AlertCircle className="h-4 w-4" />
//   <AlertTitle>Information</AlertTitle>
//   <AlertDescription>
//     This is an informational alert message.
//   </AlertDescription>
// </Alert>
//
// <Alert variant="destructive">
//   <AlertTriangle className="h-4 w-4" />
//   <AlertTitle>Error</AlertTitle>
//   <AlertDescription>
//     Something went wrong. Please try again.
//   </AlertDescription>
// </Alert>

export { Alert, AlertTitle, AlertDescription }