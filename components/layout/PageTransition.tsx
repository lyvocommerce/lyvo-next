"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back

  useEffect(() => {
    // Detect if navigation is going back (to root)
    if (pathname === "/") {
      setDirection(1);
    } else {
      setDirection(-1);
    }
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ x: direction * 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.6,
      }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
