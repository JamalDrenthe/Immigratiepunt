import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  isOpen?: boolean;
};

export function FAQ() {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState<FAQItem[]>([
    { id: 1, question: 'faq.question1', answer: 'faq.answer1', isOpen: false },
    { id: 2, question: 'faq.question2', answer: 'faq.answer2', isOpen: false },
    { id: 3, question: 'faq.question3', answer: 'faq.answer3', isOpen: false },
    { id: 4, question: 'faq.question4', answer: 'faq.answer4', isOpen: false },
    { id: 5, question: 'faq.question5', answer: 'faq.answer5', isOpen: false },
    { id: 6, question: 'faq.question6', answer: 'faq.answer6', isOpen: false },
  ]);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq)));
  };

  return (
    <section id="faq" className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker">{t('faq.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('faq.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {faqs.map((faq) => (
            <div key={faq.id} className="mb-3 overflow-hidden rounded-xl border border-[#e6dfd8] bg-[#faf9f5]">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3 className="font-display pr-4 text-xl tracking-tight text-[#141413]">
                  {t(faq.question)}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#6c6a64] transition-transform duration-200 ${faq.isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {faq.isOpen && (
                <div className="px-6 pb-6">
                  <p className="text-sm leading-6 text-[#3d3d3a]">{t(faq.answer)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
