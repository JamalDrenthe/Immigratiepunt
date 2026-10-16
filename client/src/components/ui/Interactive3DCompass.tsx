import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Shield, Sparkles, Navigation, UserCheck } from "lucide-react";

export function Interactive3DCompass() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { label: "Postadres", desc: "Startpunt zonder woning", icon: Mail, color: "#cc785c" },
    { label: "BSN Registratie", desc: "Gemeente afspraak geregeld", icon: Shield, color: "#e8a55a" },
    { label: "Bankrekening", desc: "IBAN actief & salaris", icon: CheckCircle2, color: "#5db8a6" },
    { label: "Woning & Werk", desc: "Integratie compleet", icon: Sparkles, color: "#7c3aed" },
  ];

  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[460px] items-center justify-center select-none">
      {/* Dynamic 3D depth background glows */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-[#cc785c]/30 via-[#e8a55a]/25 to-[#5db8a6]/20 blur-3xl"
      />

      {/* Outer 3D Orbital Ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute h-[380px] w-[380px] rounded-full border border-dashed border-[#cc785c]/25"
      >
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#cc785c] shadow-lg shadow-[#cc785c]/50" />
      </motion.div>

      {/* Middle 3D Orbital Ring 2 (counter-rotating) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute h-[290px] w-[290px] rounded-full border border-[#e8a55a]/30"
      >
        <span className="absolute -bottom-2 left-1/3 h-3.5 w-3.5 rounded-full bg-[#e8a55a] shadow-lg shadow-[#e8a55a]/50" />
        <span className="absolute -top-2 right-1/4 h-2.5 w-2.5 rounded-full bg-[#5db8a6] shadow-md" />
      </motion.div>

      {/* Inner Rotating Compass Core */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full bg-gradient-to-br from-[#2a2622] via-[#1a1917] to-[#121110] p-1 shadow-2xl shadow-black/40 ring-1 ring-white/10"
      >
        {/* Subtle geometric radar grid */}
        <div className="absolute inset-2 rounded-full border border-white/5" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute h-full w-[1px] bg-white/10" />
        <div className="absolute h-[1px] w-full bg-white/10" />

        {/* Center glowing beacon */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            boxShadow: [
              "0 0 15px rgba(204,120,92,0.4)",
              "0 0 35px rgba(232,165,90,0.8)",
              "0 0 15px rgba(204,120,92,0.4)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#cc785c] to-[#e8a55a] text-white"
        >
          <Navigation className="h-7 w-7 rotate-45 transform" />
        </motion.div>
      </motion.div>

      {/* Floating 3D Interactive Milestones around the compass */}
      {steps.map((step, index) => {
        const angles = [20, 110, 200, 290];
        const angle = angles[index];
        const radian = (angle * Math.PI) / 180;
        const radius = 170;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        const Icon = step.icon;
        const isActive = activeStep === index;

        return (
          <motion.div
            key={step.label}
            style={{
              x,
              y,
            }}
            animate={{
              y: [y - 4, y + 4, y - 4],
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onMouseEnter={() => setActiveStep(index)}
            className={`group absolute cursor-pointer rounded-xl border px-3 py-2 text-xs font-medium backdrop-blur-md transition-all duration-300 ${
              isActive
                ? "scale-110 border-[#cc785c] bg-[#1f1d1a] text-white shadow-xl shadow-[#cc785c]/30 z-20"
                : "border-[#e6dfd8]/60 bg-white/90 text-[#3d3d3a] shadow-md hover:border-[#cc785c]/50 hover:bg-white z-10"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: step.color }}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-semibold leading-tight">{step.label}</p>
                <p className="text-[10px] text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Floating Live Verification Badge in 3D perspective */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute -bottom-4 z-30 flex items-center gap-2.5 rounded-full border border-[#e6dfd8] bg-[#faf9f5]/95 px-4 py-2 text-xs font-medium text-[#141413] shadow-lg backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <UserCheck className="h-3.5 w-3.5 text-[#cc785c]" />
        <span>Postadres-netwerk actief in heel Nederland</span>
      </motion.div>
    </div>
  );
}
