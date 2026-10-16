import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionReveal } from "@/components/ui/MotionWrapper";

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
    <section id="faq" className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-20 md:py-28 relative">
      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up" className="mb-14 max-w-2xl">
          <div className="section-kicker">{t('faq.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('faq.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('faq.subtitle')}
          </p>
        </MotionReveal>

        <div className="mx-auto max-w-4xl space-y-3.5">
          {faqs.map((faq) => (
            <MotionReveal key={faq.id} direction="up" distance={15}>
              <div className="overflow-hidden rounded-2xl border border-[#e6dfd8] bg-[#faf9f5] shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <h3 className="font-display pr-4 text-xl font-medium tracking-tight text-[#141413]">
                    {t(faq.question)}
                  </h3>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#efe9de] transition-transform duration-300 ${faq.isOpen ? 'rotate-180 bg-primary/20 text-primary' : 'text-[#6c6a64]'}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {faq.isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-[#3d3d3a] border-t border-[#e6dfd8]/40">
                        {t(faq.answer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
