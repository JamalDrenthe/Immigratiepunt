import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, MailOpen, Landmark, Home, Briefcase } from "lucide-react";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#faf9f5]">
      <div className="container mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#efe9de] px-4 py-1.5 text-[13px] font-medium text-[#141413]">
              {t('hero.badge')}
            </div>
            <h1 className="font-display mb-6 text-5xl leading-[1.05] tracking-tight text-[#141413] md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mb-9 max-w-xl text-lg leading-relaxed text-[#3d3d3a]">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registreren"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]"
              >
                {t('hero.getStartedButton')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/help-mee"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-6 text-sm font-medium text-[#141413] transition-colors hover:bg-[#efe9de]"
              >
                {t('hero.helpButton')}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-[#6c6a64]">
              {(t('hero.trustPoints', { returnObjects: true }) as string[]).map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Dark mockup card — mail → BSN flow */}
          <div className="rounded-2xl bg-[#181715] p-8 text-[#faf9f5]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#a09d96]">
              {t('hero.mockTitle')}
            </div>
            <div className="font-display mb-8 text-3xl tracking-tight">
              {t('hero.mockHeading')}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#252320] px-5 py-4">
                <span className="flex items-center gap-3 text-sm">
                  <MailOpen className="h-5 w-5 text-primary" />
                  {t('hero.mockMail')}
                </span>
                <span className="font-display text-xl text-[#e8a55a]">€0,50+</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#252320] px-5 py-4">
                <span className="flex items-center gap-3 text-sm">
                  <Landmark className="h-5 w-5 text-[#5db8a6]" />
                  {t('hero.mockBanking')}
                </span>
                <span className="font-display text-xl">01</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#252320] px-5 py-4">
                <span className="flex items-center gap-3 text-sm">
                  <Home className="h-5 w-5 text-[#5db8a6]" />
                  {t('hero.mockHousing')}
                </span>
                <span className="font-display text-xl">02</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#252320] px-5 py-4">
                <span className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-5 w-5 text-[#5db8a6]" />
                  {t('hero.mockWork')}
                </span>
                <span className="font-display text-xl">03</span>
              </div>
            </div>
            <div className="mt-6 text-xs leading-5 text-[#a09d96]">
              {t('hero.mockFootnote')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
