import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, MailOpen, Landmark, Home, ShieldCheck, Sparkles } from "lucide-react";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[#faf9f5] py-16 md:py-24">
      {/* Background Animated Motion Mesh / 3D ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-[#cc785c]/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[-100px] h-[480px] w-[480px] rounded-full bg-[#e8a55a]/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#e6dfd8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Headline and Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e6dfd8] bg-[#efe9de]/70 px-4 py-1.5 text-[13px] font-medium text-[#141413] shadow-sm backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display mb-6 text-5xl leading-[1.05] tracking-tight text-[#141413] md:text-6xl"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mb-9 max-w-xl text-lg leading-relaxed text-[#3d3d3a]"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/registreren"
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-7 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#a9583e] hover:shadow-xl hover:shadow-primary/30"
              >
                <span>{t('hero.getStartedButton')}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/help-mee"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#e6dfd8] bg-white/80 px-7 text-sm font-medium text-[#141413] shadow-sm backdrop-blur transition-all hover:bg-[#efe9de] hover:border-[#d6cfc7]"
              >
                {t('hero.helpButton')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-[#6c6a64]"
            >
              {(t('hero.trustPoints', { returnObjects: true }) as string[]).map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Authentic Process Card */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <ThreeDCard depth={8} className="rounded-3xl shadow-xl shadow-black/10">
                <div className="relative rounded-3xl border border-white/10 bg-[#181715] p-7 text-[#faf9f5] sm:p-8">
                  {/* Top Pill / Badge inside space */}
                  <ThreeDItem translateZ={20} className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a09d96]">
                      Immigratiepunt • Traject
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Erkend Briefadres</span>
                    </div>
                  </ThreeDItem>

                  <ThreeDItem translateZ={25}>
                    <div className="font-display my-2 text-2xl font-medium tracking-tight text-[#faf9f5] sm:text-3xl">
                      Van postadres naar BSN & werk
                    </div>
                    <p className="text-xs text-[#a09d96] mb-5 leading-relaxed">
                      De getoetste route om zonder vast huurcontract toch officieel ingeschreven te raken in Nederland.
                    </p>
                  </ThreeDItem>

                  {/* 4 Interactive Process Steps */}
                  <div className="space-y-2.5">
                    <ThreeDItem translateZ={15}>
                      <div className="flex items-center justify-between rounded-xl bg-[#252320]/90 px-4 py-3.5 border border-white/5 transition-colors hover:border-primary/40">
                        <span className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
                            <MailOpen className="h-4 w-4" />
                          </span>
                          <span>1. Postadres-helper koppeling</span>
                        </span>
                        <span className="text-xs font-semibold text-[#e8a55a]">€0,50 - €5 / post</span>
                      </div>
                    </ThreeDItem>

                    <ThreeDItem translateZ={20}>
                      <div className="flex items-center justify-between rounded-xl bg-[#252320]/90 px-4 py-3.5 border border-white/5 transition-colors hover:border-emerald-500/40">
                        <span className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <span>2. Gemeente BSN inschrijving</span>
                        </span>
                        <span className="text-xs font-medium text-emerald-400">Art. 2.45 BRP</span>
                      </div>
                    </ThreeDItem>

                    <ThreeDItem translateZ={15}>
                      <div className="flex items-center justify-between rounded-xl bg-[#252320]/90 px-4 py-3.5 border border-white/5 transition-colors hover:border-blue-500/40">
                        <span className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                            <Landmark className="h-4 w-4" />
                          </span>
                          <span>3. Bankrekening via Xabi World</span>
                        </span>
                        <span className="text-xs font-medium text-blue-300">IBAN in 48u</span>
                      </div>
                    </ThreeDItem>

                    <ThreeDItem translateZ={15}>
                      <div className="flex items-center justify-between rounded-xl bg-[#252320]/90 px-4 py-3.5 border border-white/5 transition-colors hover:border-amber-500/40">
                        <span className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                            <Home className="h-4 w-4" />
                          </span>
                          <span>4. Huisvesting & Werk</span>
                        </span>
                        <span className="text-xs font-medium text-[#a09d96]">WoningVry & Djobba</span>
                      </div>
                    </ThreeDItem>
                  </div>

                  <ThreeDItem translateZ={10}>
                    <div className="mt-5 flex items-center justify-between text-[11px] leading-5 text-[#a09d96] border-t border-white/10 pt-3">
                      <span>Uitsluitend briefadres • Geen medebewonersplicht</span>
                      <span className="font-semibold text-primary">Veilig & Betrouwbaar</span>
                    </div>
                  </ThreeDItem>
                </div>
              </ThreeDCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
