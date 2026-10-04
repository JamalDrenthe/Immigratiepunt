import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Home, Briefcase, FileText, Landmark, ArrowRight } from "lucide-react";

type Service = {
  id: number;
  name: string;
  imageUrl: string;
  icon: string;
};

type ServicesResponse = {
  success: boolean;
  data: Service[];
};

const serviceIcons: Record<string, React.ReactNode> = {
  university: <Landmark className="h-6 w-6 text-primary" />,
  home: <Home className="h-6 w-6 text-primary" />,
  briefcase: <Briefcase className="h-6 w-6 text-primary" />,
  "file-text": <FileText className="h-6 w-6 text-primary" />
};

export function Services() {
  const { t } = useTranslation();

  const { data: services, isLoading } = useQuery<ServicesResponse>({
    queryKey: ['/api/services'],
  });

  return (
    <section id="services" className="bg-[#faf9f5] py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
          <div className="section-kicker">{t('services.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('services.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#efe9de] p-8">
                <div className="mb-6 h-6 w-6 animate-pulse rounded bg-[#e6dfd8]" />
                <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-[#e6dfd8]" />
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-[#e6dfd8]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[#e6dfd8]" />
              </div>
            ))
          ) : (
            services?.data?.map((service: Service) => (
              <ServiceCard key={service.id} name={service.name} icon={service.icon} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ name, icon }: { name: string; icon: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-xl bg-[#efe9de] p-8">
      <div className="mb-6">{serviceIcons[icon]}</div>
      <h3 className="font-display mb-3 text-2xl tracking-tight text-[#141413]">
        {t(`services.${name}.title`)}
      </h3>
      <p className="mb-6 flex-1 text-sm leading-6 text-[#3d3d3a]">
        {t(`services.${name}.description`)}
      </p>
      <Link
        href="/registreren"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-[#a9583e]"
      >
        {t('services.learnMore')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
