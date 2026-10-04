import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { ArrowRight, MailOpen, Home, BadgeCheck, HandCoins } from "lucide-react";

export default function HelpMee() {
  const { t } = useTranslation();

  const steps = [
    { number: "01", title: 'helpMee.steps.step1.title', description: 'helpMee.steps.step1.description' },
    { number: "02", title: 'helpMee.steps.step2.title', description: 'helpMee.steps.step2.description' },
    { number: "03", title: 'helpMee.steps.step3.title', description: 'helpMee.steps.step3.description' },
  ];

  const tiers = [
    { key: "start", featured: false },
    { key: "growth", featured: true },
    { key: "donation", featured: false },
  ];

  return (
    <>
      <Helmet>
        <title>{t('helpMee.meta.title')}</title>
        <meta name="description" content={t('helpMee.meta.description')} />
      </Helmet>

      {/* Hero */}
      <section className="bg-[#faf9f5]">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#efe9de] px-4 py-1.5 text-[13px] font-medium text-[#141413]">
              <MailOpen className="h-4 w-4 text-primary" />
              {t('helpMee.badge')}
            </div>
            <h1 className="font-display mb-6 text-5xl leading-[1.05] tracking-tight text-[#141413] md:text-6xl">
              {t('helpMee.title')}
            </h1>
            <p className="mb-9 max-w-2xl text-lg leading-relaxed text-[#3d3d3a]">
              {t('helpMee.subtitle')}
            </p>
            <Link
              href="/registreren?type=helper"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]"
            >
              {t('helpMee.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Postadres vs woonadres */}
      <section className="bg-[#faf9f5] pb-20 md:pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-[#efe9de] p-8">
              <MailOpen className="mb-6 h-6 w-6 text-primary" />
              <h3 className="font-display mb-3 text-2xl tracking-tight text-[#141413]">
                {t('helpMee.explain.what.title')}
              </h3>
              <p className="text-sm leading-6 text-[#3d3d3a]">
                {t('helpMee.explain.what.text')}
              </p>
            </div>
            <div className="rounded-xl bg-[#efe9de] p-8">
              <Home className="mb-6 h-6 w-6 text-primary" />
              <h3 className="font-display mb-3 text-2xl tracking-tight text-[#141413]">
                {t('helpMee.explain.not.title')}
              </h3>
              <p className="text-sm leading-6 text-[#3d3d3a]">
                {t('helpMee.explain.not.text')}
              </p>
            </div>
            <div className="rounded-xl bg-[#efe9de] p-8">
              <BadgeCheck className="mb-6 h-6 w-6 text-primary" />
              <h3 className="font-display mb-3 text-2xl tracking-tight text-[#141413]">
                {t('helpMee.explain.why.title')}
              </h3>
              <p className="text-sm leading-6 text-[#3d3d3a]">
                {t('helpMee.explain.why.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — dark band */}
      <section className="bg-[#181715] py-20 text-[#faf9f5] md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 max-w-2xl">
            <div className="section-kicker">{t('helpMee.steps.kicker')}</div>
            <h2 className="font-display mb-4 text-4xl tracking-tight md:text-5xl">
              {t('helpMee.steps.title')}
            </h2>
            <p className="text-lg leading-relaxed text-[#a09d96]">
              {t('helpMee.steps.subtitle')}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-xl bg-[#252320] p-8">
                <div className="font-display mb-6 text-4xl text-[#e8a55a]">{step.number}</div>
                <h3 className="font-display mb-3 text-2xl tracking-tight">{t(step.title)}</h3>
                <p className="text-sm leading-6 text-[#a09d96]">{t(step.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="bg-[#faf9f5] py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 max-w-2xl">
            <div className="section-kicker">{t('helpMee.earnings.kicker')}</div>
            <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
              {t('helpMee.earnings.title')}
            </h2>
            <p className="text-lg leading-relaxed text-[#3d3d3a]">
              {t('helpMee.earnings.subtitle')}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.key}
                className={
                  tier.featured
                    ? "rounded-xl bg-[#181715] p-8 text-[#faf9f5]"
                    : "rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8"
                }
              >
                <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.15em] ${tier.featured ? 'text-[#a09d96]' : 'text-[#6c6a64]'}`}>
                  {t(`helpMee.earnings.${tier.key}.label`)}
                </div>
                <div className="font-display mb-4 text-5xl tracking-tight">
                  {t(`helpMee.earnings.${tier.key}.amount`)}
                </div>
                <p className={`text-sm leading-6 ${tier.featured ? 'text-[#a09d96]' : 'text-[#3d3d3a]'}`}>
                  {t(`helpMee.earnings.${tier.key}.text`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-4 rounded-xl bg-[#efe9de] p-8">
            <HandCoins className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-[#3d3d3a]">{t('helpMee.earnings.note')}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#faf9f5] pb-20 md:pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-xl bg-primary p-10 text-center text-white md:p-16">
            <h2 className="font-display mx-auto mb-4 max-w-2xl text-4xl tracking-tight md:text-5xl">
              {t('helpMee.ctaBand.title')}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/85">
              {t('helpMee.ctaBand.subtitle')}
            </p>
            <Link
              href="/registreren?type=helper"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#faf9f5] px-6 text-sm font-medium text-[#141413] transition-colors hover:bg-white"
            >
              {t('helpMee.ctaBand.button')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
