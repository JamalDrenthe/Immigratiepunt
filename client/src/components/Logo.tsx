export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Four-spoke compass star — the "punt" */}
      <path
        d="M16 2 L18.4 13.6 L30 16 L18.4 18.4 L16 30 L13.6 18.4 L2 16 L13.6 13.6 Z"
        fill="hsl(15 54% 58%)"
      />
      <circle cx="16" cy="16" r="2.4" fill="hsl(45 29% 97%)" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span
        className={`font-display text-[22px] font-medium leading-none tracking-tight ${
          inverted ? "text-[#faf9f5]" : "text-[#141413]"
        }`}
      >
        Immigratie<span className="text-primary">punt</span>
      </span>
    </span>
  );
}
