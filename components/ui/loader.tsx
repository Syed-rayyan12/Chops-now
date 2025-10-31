"use client"

import { motion } from "framer-motion"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loader({ size = "md", className = "" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-4 border-t-primary border-r-transparent border-b-secondary border-l-transparent ${className}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  )
}