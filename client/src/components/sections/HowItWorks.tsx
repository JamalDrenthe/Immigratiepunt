import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { number: "01", title: 'howItWorks.step1.title', description: 'howItWorks.step1.description' },
    { number: "02", title: 'howItWorks.step2.title', description: 'howItWorks.step2.description' },
    { number: "03", title: 'howItWorks.step3.title', description: 'howItWorks.step3.description' },
  ];

  return (
    <section id="how-it-works" className="bg-[#181715] py-20 text-[#faf9f5] md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker">{t('howItWorks.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight md:text-5xl">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#a09d96]">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-xl bg-[#252320] p-8">
              <div className="font-display mb-6 text-4xl text-[#e8a55a]">{step.number}</div>
              <h3 className="font-display mb-3 text-2xl tracking-tight">
                {t(step.title)}
              </h3>
              <p className="text-sm leading-6 text-[#a09d96]">
                {t(step.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
