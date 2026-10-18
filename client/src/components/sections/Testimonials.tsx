import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrapper";
import { ThreeDCard, ThreeDItem } from "@/components/ui/ThreeDCard";

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      text: 'testimonials.testimonial1.text',
      author: t('testimonials.testimonial1.author', 'Fatima Al-Mansoor'),
      role: t('testimonials.testimonial1.role', 'Nieuwkomer • Amsterdam (BSN balie)'),
      badge: t('testimonials.testimonial1.badge', 'Nieuwkomer'),
      rating: 5,
    },
    {
      id: 2,
      text: 'testimonials.testimonial2.text',
      author: t('testimonials.testimonial2.author', 'Jan de Vries'),
      role: t('testimonials.testimonial2.role', 'Postadres-Helper • Amsterdam-Centrum'),
      badge: t('testimonials.testimonial2.badge', 'Helper'),
      rating: 5,
    },
    {
      id: 3,
      text: 'testimonials.testimonial3.text',
      author: t('testimonials.testimonial3.author', 'Oleksandr Petrenko'),
      role: t('testimonials.testimonial3.role', 'Nieuwkomer • Rotterdam (Werk & IBAN)'),
      badge: t('testimonials.testimonial3.badge', 'Nieuwkomer'),
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="bg-[#faf9f5] py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up" className="mb-14 max-w-2xl">
          <div className="section-kicker">{t('testimonials.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('testimonials.subtitle')}
          </p>
        </MotionReveal>

        <MotionStaggerContainer className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <MotionStaggerItem key={testimonial.id}>
              <ThreeDCard depth={8} className="h-full rounded-2xl">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-[#e6dfd8] bg-white/90 p-8 shadow-sm backdrop-blur transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-[#cc785c]/10">
                  <div>
                    <ThreeDItem translateZ={15}>
                      <div className="mb-5 flex items-center gap-1">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#e8a55a] text-[#e8a55a]" />
                        ))}
                      </div>
                    </ThreeDItem>
                    <ThreeDItem translateZ={25}>
                      <p className="font-display mb-6 text-xl leading-relaxed text-[#252523] italic">
                        "{t(testimonial.text)}"
                      </p>
                    </ThreeDItem>
                  </div>
                  <ThreeDItem translateZ={20}>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#e6dfd8]/60">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#efe9de] to-[#e6dfd8] text-sm font-bold text-[#141413] shadow-inner">
                        {testimonial.author.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#141413]">{testimonial.author}</div>
                        <div className="text-xs text-[#8e8b82]">{testimonial.role}</div>
                      </div>
                    </div>
                  </ThreeDItem>
                </div>
              </ThreeDCard>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>
      </div>
    </section>
  );
}
