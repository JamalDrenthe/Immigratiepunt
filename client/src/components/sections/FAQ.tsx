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
    <section id="faq" className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <Card key={faq.id} className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-6 focus:outline-none"
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3 className="text-lg font-medium text-left">
                  {t(faq.question)}
                </h3>
                <ChevronDown 
                  className={`h-6 w-6 transform transition-transform duration-200 ${faq.isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              {faq.isOpen && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-gray-600">{t(faq.answer)}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
