"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-white text-center px-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold mb-6"
      >
       NewsRoom
      </motion.h1>

      {/* Coming soon text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-2xl md:text-3xl font-medium mb-10"
      >
         This page is coming soon!
      </motion.p>

      {/* Bouncing icon */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-7xl">⌛</span>
      </motion.div>
    </div>
  );
}
