import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      text: 'testimonials.testimonial1.text',
      author: 'Sarah Johnson',
      role: 'Software Engineer from Canada',
      rating: 5
    },
    {
      id: 2,
      text: 'testimonials.testimonial2.text',
      author: 'Miguel Rodriguez',
      role: 'Marketing Director from Spain',
      rating: 5
    },
    {
      id: 3,
      text: 'testimonials.testimonial3.text',
      author: 'Yuki Tanaka',
      role: 'Financial Analyst from Japan',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <div className="section-kicker">Ervaringen</div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#082335] md:text-5xl">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg leading-8 text-slate-500">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="rounded-3xl border-slate-200/80 bg-white p-8 shadow-sm">
              <CardContent className="p-0">
                <div className="mb-5 flex items-center">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-lg leading-8 text-slate-600">
                  "{t(testimonial.text)}"
                </p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-bold text-[#082335]">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
