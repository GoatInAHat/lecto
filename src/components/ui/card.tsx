"use client"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "rounded-2xl border border-border bg-surface-1/80 backdrop-blur-sm",
        hover && "cursor-pointer hover:border-border-hover",
        glow && "glow-accent",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
