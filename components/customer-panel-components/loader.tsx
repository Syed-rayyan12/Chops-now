"use client"

import { motion } from "framer-motion"

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0F3D2E]">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-t-[#DCAA03] border-r-transparent border-b-[#DCAA03] border-l-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}
