"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, onClick, type = "button" }, ref) => {
    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-light shadow-md hover:shadow-lg",
      secondary:
        "bg-surface-2 text-text-primary border border-border hover:border-border-hover hover:bg-surface-3",
      ghost:
        "text-text-secondary hover:text-text-primary hover:bg-surface-2",
      danger:
        "bg-error/10 text-error border border-error/20 hover:bg-error/20",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-5 py-2.5 text-sm rounded-xl",
      lg: "px-8 py-3.5 text-base rounded-xl",
    }

    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={isDisabled ? {} : { y: -1 }}
        whileTap={isDisabled ? {} : { y: 0, scale: 0.98 }}
        onClick={isDisabled ? undefined : onClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold tracking-tight focus-ring cursor-pointer",
          isDisabled && "opacity-50 cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        style={isDisabled ? { pointerEvents: "none" } : undefined}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
Button.displayName = "Button"
export { Button }
