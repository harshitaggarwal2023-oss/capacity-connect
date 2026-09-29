import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "error";
}

const MetalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50",
          "h-9 px-4 py-2 border shadow-sm",
          variant === "default" && "bg-zinc-800 text-zinc-50 hover:bg-zinc-800/90",
          variant === "success" && "bg-green-600 text-white hover:bg-green-700",
          variant === "error" && "bg-red-600 text-white hover:bg-red-700",
          className
        )}
        {...props}
      />
    )
  }
)
MetalButton.displayName = "MetalButton"

export { MetalButton }
