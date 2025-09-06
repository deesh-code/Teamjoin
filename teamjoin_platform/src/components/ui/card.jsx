// ==================== CARD COMPONENTS ====================
// Cards are containers that group related content together
// Think of them like boxes that hold information, like a business card

import * as React from "react"
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== MAIN CARD CONTAINER ====================
// This is the outer container that wraps all card content
// It has rounded corners, a border, and a subtle shadow
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base card styles using semantic design tokens
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className // Allow custom styles to be added
    )}
    {...props} // Pass through all other props
  />
))
Card.displayName = "Card"

// ==================== CARD HEADER ====================
// The top section of the card, usually contains title and description
// Has extra spacing and is arranged vertically
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6", // Vertical layout with spacing and padding
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// ==================== CARD TITLE ====================
// The main heading for the card
// Uses semantic text styling for consistency
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Large, bold text for the main title
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ==================== CARD DESCRIPTION ====================
// Subtitle or description text below the title
// Uses muted colors to be less prominent than the title
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground", // Smaller, muted text
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ==================== CARD CONTENT ====================
// The main body of the card where most content goes
// Has padding but no top padding (since header has bottom padding)
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "p-6 pt-0", // Padding on all sides except top
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

// ==================== CARD FOOTER ====================
// Bottom section of the card, often contains action buttons
// Uses flexbox to arrange items horizontally
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0", // Horizontal layout with centered items
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// ==================== EXAMPLE USAGE ====================
// <Card>
//   <CardHeader>
//     <CardTitle>Card Title</CardTitle>
//     <CardDescription>This is a description</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <p>This is the main content of the card</p>
//   </CardContent>
//   <CardFooter>
//     <Button>Action Button</Button>
//   </CardFooter>
// </Card>

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }