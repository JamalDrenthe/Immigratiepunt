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
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white rounded-xl shadow-sm p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "{t(testimonial.text)}"
                </p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
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
