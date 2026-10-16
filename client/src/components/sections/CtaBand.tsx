import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";

export function CtaBand() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#faf9f5] py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up">
          <ThreeDCard depth={6} className="rounded-3xl shadow-2xl shadow-primary/20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#cc785c] via-[#bf6448] to-[#99472e] p-10 text-center text-white md:p-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/20 blur-2xl" />

              <ThreeDItem translateZ={25}>
                <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                  <span>Jouw Toekomst Begint Hier</span>
                </div>
              </ThreeDItem>

              <ThreeDItem translateZ={35}>
                <h2 className="font-display mx-auto mb-4 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
                  {t('cta.title')}
                </h2>
              </ThreeDItem>

              <ThreeDItem translateZ={20}>
                <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/90">
                  {t('cta.subtitle')}
                </p>
              </ThreeDItem>

              <ThreeDItem translateZ={30}>
                <div className="flex flex-col justify-center gap-3.5 sm:flex-row">
                  <Link
                    href="/registreren"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#141413] shadow-lg transition-all hover:bg-[#faf9f5] hover:scale-102"
                  >
                    <span>{t('cta.newcomerButton')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/help-mee"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-black/20 px-7 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-black/30"
                  >
                    {t('cta.helperButton')}
                  </Link>
                </div>
              </ThreeDItem>
            </div>
          </ThreeDCard>
        </MotionReveal>
      </div>
    </section>
  );
}
