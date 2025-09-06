// ==================== CHECKBOX COMPONENT ====================
// Checkboxes let users select one or more options from a list
// Perfect for settings, form selections, or todo lists

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox" // Provides accessibility features
import { Check } from "lucide-react" // Checkmark icon
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== CHECKBOX COMPONENT ====================
// A checkbox that users can check/uncheck
// Shows a checkmark icon when selected
// Example usage: <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base checkbox styles using semantic design tokens
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background " +
      // Focus styles - what happens when user tabs to checkbox
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
      // Disabled state - when checkbox is not interactive
      "disabled:cursor-not-allowed disabled:opacity-50 " +
      // Checked state - when checkbox is selected (changes background and text color)
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props} // Pass through checked, onCheckedChange, disabled, etc.
  >
    {/* The checkmark indicator that appears when checkbox is checked */}
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {/* The actual checkmark icon */}
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

// Set display name for debugging tools
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// ==================== EXAMPLE USAGE ====================
// const [isChecked, setIsChecked] = useState(false)
// 
// <div className="flex items-center space-x-2">
//   <Checkbox 
//     id="terms" 
//     checked={isChecked}
//     onCheckedChange={setIsChecked}
//   />
//   <Label htmlFor="terms">Accept terms and conditions</Label>
// </div>

export { Checkbox }