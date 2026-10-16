import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { number: "01", title: 'howItWorks.step1.title', description: 'howItWorks.step1.description' },
    { number: "02", title: 'howItWorks.step2.title', description: 'howItWorks.step2.description' },
    { number: "03", title: 'howItWorks.step3.title', description: 'howItWorks.step3.description' },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#181715] py-20 text-[#faf9f5] md:py-28">
      {/* Subtle background ambient particle light */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#e8a55a]/10 blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up" className="mb-14 max-w-2xl">
          <div className="section-kicker">{t('howItWorks.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#faf9f5] md:text-5xl">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#a09d96]">
            {t('howItWorks.subtitle')}
          </p>
        </MotionReveal>

        <MotionStaggerContainer className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <MotionStaggerItem key={step.number}>
              <ThreeDCard depth={10} className="h-full rounded-2xl">
                <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#252320]/90 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-primary/50">
                  <ThreeDItem translateZ={30}>
                    <div className="font-display mb-6 text-5xl font-bold text-[#e8a55a] transition-transform duration-300 group-hover:scale-105">
                      {step.number}
                    </div>
                  </ThreeDItem>
                  <ThreeDItem translateZ={20}>
                    <h3 className="font-display mb-3 text-2xl font-medium tracking-tight text-[#faf9f5] transition-colors group-hover:text-primary">
                      {t(step.title)}
                    </h3>
                  </ThreeDItem>
                  <ThreeDItem translateZ={15}>
                    <p className="text-sm leading-relaxed text-[#a09d96]">
                      {t(step.description)}
                    </p>
                  </ThreeDItem>
                </div>
              </ThreeDCard>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>
      </div>
    </section>
  );
}
