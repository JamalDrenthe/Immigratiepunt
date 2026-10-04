import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    { id: 1, text: 'testimonials.testimonial1.text', author: 'Sarah Johnson', role: 'Software Engineer — Canada', rating: 5 },
    { id: 2, text: 'testimonials.testimonial2.text', author: 'Miguel Rodriguez', role: 'Marketing Director — Spain', rating: 5 },
    { id: 3, text: 'testimonials.testimonial3.text', author: 'Yuki Tanaka', role: 'Financial Analyst — Japan', rating: 5 },
  ];

  return (
    <section id="testimonials" className="bg-[#faf9f5] py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker">{t('testimonials.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8">
              <div className="mb-5 flex items-center gap-0.5">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#e8a55a] text-[#e8a55a]" />
                ))}
              </div>
              <p className="font-display mb-6 text-xl leading-relaxed text-[#252523]">
                "{t(testimonial.text)}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe9de] text-sm font-semibold text-[#6c6a64]">
                  {testimonial.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#141413]">{testimonial.author}</div>
                  <div className="text-xs text-[#8e8b82]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
