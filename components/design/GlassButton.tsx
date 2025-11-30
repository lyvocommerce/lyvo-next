"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "icon";
}

export default function GlassButton({
  children,
  variant = "default",
  className = "",
  ...props
}: GlassButtonProps) {
  const baseClasses =
    "bg-white/10 backdrop-blur-md border border-white/40 text-black font-semibold hover:bg-white/20 transition-all shadow-lg rounded-full";
  const variantClasses = variant === "icon" ? "py-3 px-3" : "py-3 px-6";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
