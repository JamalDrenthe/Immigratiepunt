import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: 'howItWorks.step1.title',
      description: 'howItWorks.step1.description'
    },
    {
      number: 2,
      title: 'howItWorks.step2.title',
      description: 'howItWorks.step2.description'
    },
    {
      number: 3,
      title: 'howItWorks.step3.title',
      description: 'howItWorks.step3.description'
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#082335] py-20 text-white md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <div className="section-kicker text-accent">Zo werkt het</div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg leading-8 text-white/65">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <Card key={step.number} className="relative rounded-3xl border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
              <CardContent className="p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent font-extrabold text-[#082335]">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-bold">
                  {t(step.title)}
                </h3>
                <p className="leading-7 text-white/65">
                  {t(step.description)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
