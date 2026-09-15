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
    <section id="how-it-works" className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <Card key={step.number} className="bg-white rounded-xl shadow-sm relative">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t(step.title)}
                </h3>
                <p className="text-gray-600">
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
