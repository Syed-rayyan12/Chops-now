"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

export default function ScrollMarquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 🚀 Adjusted for full visibility
  // Calculate a proper transform range based on content width
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]); // right → left
  const x2 = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]); // left → right

  const content1 = (
    <>
      <span className="mx-10 text-5xl font-bold text-primary">
        Welcome to Our Store — Great Deals Everyday!
      </span>
    
    </>
  );

  const content2 = (
    <>
      <span className="mx-10 text-5xl font-bold text-primary">
        Best Quality — Trusted by Thousands!
      </span>
     
    </>
  );

  return (
    <div ref={ref} className="overflow-hidden w-full bg-white py-20 space-y-10">
      {/* Row 1: right → left */}
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        <motion.div
          style={{ x: x1 }}
          className="inline-flex whitespace-nowrap"
        >
          {content1}
          {content1}
        </motion.div>
      </div>

      {/* Row 2: left → right */}
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        <motion.div
          style={{ x: x2 }}
          className="inline-flex whitespace-nowrap"
        >
          {content2}
          {content2}
        </motion.div>
      </div>
    </div>
  );
}