import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  isOpen?: boolean;
};

export function FAQ() {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: 'faq.question1',
      answer: 'faq.answer1',
      isOpen: false
    },
    {
      id: 2,
      question: 'faq.question2',
      answer: 'faq.answer2',
      isOpen: false
    },
    {
      id: 3,
      question: 'faq.question3',
      answer: 'faq.answer3',
      isOpen: false
    },
    {
      id: 4,
      question: 'faq.question4',
      answer: 'faq.answer4',
      isOpen: false
    }
  ]);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };

  return (
    <section id="faq" className="bg-slate-100/70 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <div className="section-kicker">Veelgestelde vragen</div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#082335] md:text-5xl">
            {t('faq.title')}
          </h2>
          <p className="text-lg leading-8 text-slate-500">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <Card key={faq.id} className="mb-4 overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-sm">
              <button 
                className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3 className="text-lg font-bold text-[#082335]">
                  {t(faq.question)}
                </h3>
                <ChevronDown 
                  className={`h-6 w-6 transform transition-transform duration-200 ${faq.isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              {faq.isOpen && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="leading-7 text-slate-500">{t(faq.answer)}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
