// ==================== ACCORDION COMPONENTS ====================
// Accordion allows you to show/hide content sections
// Perfect for FAQs, settings panels, or organizing information

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion" // Provides accessibility features
import { ChevronDown } from "lucide-react" // Down arrow icon
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== MAIN ACCORDION CONTAINER ====================
// This is the wrapper that holds all accordion items
const Accordion = AccordionPrimitive.Root

// ==================== INDIVIDUAL ACCORDION ITEM ====================
// Each section of content that can be expanded/collapsed
// Has a bottom border to separate from other items
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b", // Bottom border to separate items
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

// ==================== ACCORDION TRIGGER (HEADER) ====================
// The clickable part that expands/collapses the content
// Contains the title and the arrow icon
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Layout: flex container with space between title and icon
        "flex flex-1 items-center justify-between py-4 font-medium transition-all " +
        // Hover effect: underline text when hovering
        "hover:underline " +
        // Icon rotation: rotate arrow when accordion is open
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children} {/* The title text */}
      {/* Down arrow icon that rotates when accordion opens */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

// ==================== ACCORDION CONTENT ====================
// The expandable content area that shows/hides
// Has smooth animations when opening and closing
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={
      // Handle overflow and add smooth animations
      "overflow-hidden text-sm transition-all " +
      // Animation when closing (sliding up)
      "data-[state=closed]:animate-accordion-up " +
      // Animation when opening (sliding down)
      "data-[state=open]:animate-accordion-down"
    }
    {...props}
  >
    {/* Inner container with padding */}
    <div className={cn("pb-4 pt-0", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// ==================== EXAMPLE USAGE ====================
// <Accordion type="single" collapsible>
//   <AccordionItem value="item-1">
//     <AccordionTrigger>What is this?</AccordionTrigger>
//     <AccordionContent>
//       This is the answer to the question.
//     </AccordionContent>
//   </AccordionItem>
//   <AccordionItem value="item-2">
//     <AccordionTrigger>How does it work?</AccordionTrigger>
//     <AccordionContent>
//       Here's how it works...
//     </AccordionContent>
//   </AccordionItem>
// </Accordion>

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }