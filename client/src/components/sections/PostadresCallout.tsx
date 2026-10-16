import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, MailOpen, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";

export function PostadresCallout() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#faf9f5] pb-20 md:pb-28">
      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up">
          <ThreeDCard depth={8} className="rounded-3xl shadow-2xl shadow-primary/20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#cc785c] via-[#bf6448] to-[#99472e] p-10 text-white md:p-16">
              {/* Background decorative circles */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-black/15 blur-2xl" />

              <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1fr_auto]">
                <div>
                  <ThreeDItem translateZ={25}>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] backdrop-blur-md shadow-sm">
                      <MailOpen className="h-4 w-4" />
                      <span>{t('postadres.badge')}</span>
                      <Sparkles className="h-3 w-3 text-amber-200" />
                    </div>
                  </ThreeDItem>
                  <ThreeDItem translateZ={35}>
                    <h2 className="font-display mb-4 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
                      {t('postadres.calloutTitle')}
                    </h2>
                  </ThreeDItem>
                  <ThreeDItem translateZ={20}>
                    <p className="max-w-2xl text-base leading-relaxed text-white/90">
                      {t('postadres.calloutText')}
                    </p>
                  </ThreeDItem>
                </div>

                <div className="flex flex-col gap-4">
                  <ThreeDItem translateZ={30}>
                    <div className="rounded-2xl border border-white/20 bg-white/15 px-8 py-5 text-center backdrop-blur-md shadow-inner">
                      <div className="font-display text-4xl font-bold tracking-tight">€0,50 – €5</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
                        {t('postadres.perMail')}
                      </div>
                    </div>
                  </ThreeDItem>
                  <ThreeDItem translateZ={20}>
                    <Link
                      href="/help-mee"
                      className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#141413] shadow-lg transition-all hover:bg-[#faf9f5] hover:scale-102"
                    >
                      <span>{t('postadres.calloutCta')}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </ThreeDItem>
                </div>
              </div>
            </div>
          </ThreeDCard>
        </MotionReveal>
      </div>
    </section>
  );
}
