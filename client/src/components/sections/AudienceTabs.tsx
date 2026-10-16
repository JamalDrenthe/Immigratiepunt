import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MotionReveal } from "@/components/ui/MotionWrapper";
import { ThreeDCard } from "@/components/ui/ThreeDCard";

export function AudienceTabs() {
  const { t } = useTranslation();

  const panels = [
    {
      value: "newcomer",
      bullets: t('audience.newcomer.bullets', { returnObjects: true }) as string[],
      cta: "/registreren",
      ctaLabel: t('audience.newcomer.cta'),
    },
    {
      value: "helper",
      bullets: t('audience.helper.bullets', { returnObjects: true }) as string[],
      cta: "/help-mee",
      ctaLabel: t('audience.helper.cta'),
    },
  ];

  return (
    <section id="voor-wie" className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up" className="mb-12 max-w-2xl">
          <div className="section-kicker">{t('audience.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('audience.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">{t('audience.subtitle')}</p>
        </MotionReveal>

        <Tabs defaultValue="newcomer" className="w-full">
          <TabsList className="mb-8 h-auto rounded-xl bg-[#efe9de] p-1.5 ring-1 ring-[#e6dfd8]">
            <TabsTrigger
              value="newcomer"
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#6c6a64] data-[state=active]:bg-white data-[state=active]:text-[#141413] data-[state=active]:shadow-sm transition-all"
            >
              {t('audience.newcomer.tab')}
            </TabsTrigger>
            <TabsTrigger
              value="helper"
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#6c6a64] data-[state=active]:bg-white data-[state=active]:text-[#141413] data-[state=active]:shadow-sm transition-all"
            >
              {t('audience.helper.tab')}
            </TabsTrigger>
          </TabsList>

          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value} className="focus-visible:outline-none">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <ThreeDCard depth={6} className="rounded-2xl">
                    <div className="grid gap-10 rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] p-8 md:grid-cols-2 md:p-12 shadow-xl shadow-black/5">
                      <div>
                        <h3 className="font-display mb-4 text-3xl font-medium tracking-tight text-[#141413] sm:text-4xl">
                          {t(`audience.${panel.value}.heading`)}
                        </h3>
                        <p className="text-base leading-relaxed text-[#3d3d3a]">
                          {t(`audience.${panel.value}.text`)}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between gap-6">
                        <ul className="space-y-3.5">
                          {panel.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-[#3d3d3a]">
                              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2">
                          <Link
                            href={panel.cta}
                            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-[#a9583e] hover:shadow-lg"
                          >
                            <span>{panel.ctaLabel}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
