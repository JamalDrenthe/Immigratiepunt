import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Home, Briefcase, FileText, Building, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Service = {
  id: number;
  name: string;
  imageUrl: string;
  icon: string;
};

const serviceIcons: Record<string, React.ReactNode> = {
  university: <Building className="text-primary text-xl" />,
  home: <Home className="text-primary text-xl" />,
  briefcase: <Briefcase className="text-primary text-xl" />,
  "file-text": <FileText className="text-primary text-xl" />
};

export function Services() {
  const { t } = useTranslation();
  
  const { data: services, isLoading } = useQuery({
    queryKey: ['/api/services'],
  });

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Render skeleton loading state
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-1/3"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            services?.data?.map((service: Service) => (
              <ServiceCard 
                key={service.id}
                name={service.name}
                imageUrl={service.imageUrl}
                icon={service.icon}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ name, imageUrl, icon }: { name: string, imageUrl: string, icon: string }) {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <img 
        src={`${imageUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80`} 
        alt={t(`services.${name}.imageAlt`)} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {serviceIcons[icon]}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {t(`services.${name}.title`)}
        </h3>
        <p className="text-gray-600 mb-4">
          {t(`services.${name}.description`)}
        </p>
        <a href="#" className="text-primary font-medium flex items-center hover:underline">
          {t('services.learnMore')}
          <ChevronRight className="h-5 w-5 ml-1" />
        </a>
      </CardContent>
    </Card>
  );
}
