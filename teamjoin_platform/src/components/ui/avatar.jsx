// ==================== AVATAR COMPONENTS ====================
// Avatars display user profile pictures or initials
// Perfect for user profiles, comment sections, or team member lists

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar" // Provides accessibility features
import { cn } from "@/lib/utils" // Utility to combine CSS classes

// ==================== MAIN AVATAR CONTAINER ====================
// This is the circular container that holds the image or fallback
// It has a fixed size and ensures content stays within the circle
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      // Make it circular with fixed size and handle overflow
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// ==================== AVATAR IMAGE ====================
// The actual profile image that displays inside the avatar
// If the image fails to load, it will show the fallback instead
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full", // Fill the entire avatar circle
      className
    )}
    {...props} // Pass through src, alt, onError, etc.
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// ==================== AVATAR FALLBACK ====================
// What shows when the image fails to load or while it's loading
// Usually displays user initials or a default icon
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      // Center the fallback content and use muted background
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ==================== EXAMPLE USAGE ====================
// <Avatar>
//   <AvatarImage src="/user-photo.jpg" alt="User Name" />
//   <AvatarFallback>JD</AvatarFallback> {/* Shows "JD" if image fails */}
// </Avatar>

export { Avatar, AvatarImage, AvatarFallback }