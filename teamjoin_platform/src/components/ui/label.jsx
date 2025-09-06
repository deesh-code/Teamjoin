// ==================== LABEL COMPONENT ====================
// Labels are text descriptions that go with form inputs
// They help users understand what each input field is for

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label" // Provides accessibility features
import { cva } from "class-variance-authority" // Helps manage different label styles
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== LABEL STYLES ====================
// This defines how our labels will look
// Uses semantic design tokens for consistent styling
const labelVariants = cva(
  // Base styles for all labels
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// ==================== LABEL COMPONENT ====================
// A label that can be associated with form inputs for accessibility
// Example usage: <Label htmlFor="email">Email Address</Label>
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props} // Pass through htmlFor, onClick, children, etc.
  />
))

// Set display name for debugging tools
Label.displayName = LabelPrimitive.Root.displayName

// ==================== EXAMPLE USAGE ====================
// <div>
//   <Label htmlFor="email">Email Address</Label>
//   <Input id="email" type="email" placeholder="Enter your email" />
// </div>

export { Label }