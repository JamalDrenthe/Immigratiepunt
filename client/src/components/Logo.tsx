import { motion } from "framer-motion";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${className} transition-transform duration-300 group-hover:scale-105`}
    >
      <defs>
        {/* Modern Warm Terracotta to Amber Gradient */}
        <linearGradient id="ipGradientPrimary" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cc785c" />
          <stop offset="50%" stopColor="#d96b43" />
          <stop offset="100%" stopColor="#e8a55a" />
        </linearGradient>

        {/* Deep Slate Ribbon Gradient */}
        <linearGradient id="ipGradientSlate" x1="42" y1="6" x2="6" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2e2b27" />
          <stop offset="100%" stopColor="#181715" />
        </linearGradient>

        {/* Radiant Center Glow */}
        <radialGradient id="ipCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8a55a" stopOpacity="1" />
          <stop offset="60%" stopColor="#cc785c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#cc785c" stopOpacity="0" />
        </radialGradient>

        <filter id="ipGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer subtle protective ring representing shelter and welcome */}
      <circle
        cx="24"
        cy="24"
        r="21.5"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />

      {/* Dynamic interlocking ribbons - symbolising bridge, connection and new journey */}
      {/* Path 1: Welcoming arch ribbon (newcomer journey) */}
      <path
        d="M10 24C10 16.268 16.268 10 24 10C28.5 10 32.5 12.2 35 15.5L31.2 18.8C29.4 16.5 26.8 15 24 15C19.029 15 15 19.029 15 24C15 28.971 19.029 33 24 33C27.2 33 30 31.3 31.6 28.7L35.4 31.9C32.8 35.7 28.6 38 24 38C16.268 38 10 31.732 10 24Z"
        fill="url(#ipGradientPrimary)"
      />

      {/* Path 2: Complementary anchoring bridge (helper / Dutch community) */}
      <path
        d="M38 24C38 21.6 37.3 19.4 36.1 17.5L32.2 20.6C32.7 21.7 33 22.8 33 24C33 28.971 28.971 33 24 33V38C31.732 38 38 31.732 38 24Z"
        fill="url(#ipGradientSlate)"
        opacity="0.85"
      />

      {/* The Central Compass Beacon - "Het Punt" */}
      <circle cx="24" cy="24" r="5" fill="url(#ipCenterGlow)" />
      <circle cx="24" cy="24" r="3" fill="#faf9f5" />
      <circle cx="24" cy="24" r="1.5" fill="#cc785c" />

      {/* 4 Cardinal beacon sparks indicating direction & guidance */}
      <path d="M24 4V7" stroke="url(#ipGradientPrimary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 24H41" stroke="url(#ipGradientPrimary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 44V41" stroke="url(#ipGradientPrimary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 24H7" stroke="url(#ipGradientPrimary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="group flex items-center gap-3 select-none">
      <div className="relative flex items-center justify-center">
        {/* Soft background ambient pulse on hover */}
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <LogoMark className="h-9 w-9 text-current relative z-10" />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-display text-[23px] font-semibold leading-none tracking-tight transition-colors ${
            inverted ? "text-[#faf9f5]" : "text-[#141413]"
          }`}
        >
          Immigratie<span className="text-primary font-bold">punt</span>
        </span>
        <span
          className={`text-[9.5px] uppercase tracking-[0.2em] font-medium mt-0.5 ${
            inverted ? "text-[#a09d96]" : "text-[#6c6a64]"
          }`}
        >
          Nederland
        </span>
      </div>
    </div>
  );
}
