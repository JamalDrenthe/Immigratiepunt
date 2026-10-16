import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Home, Briefcase, FileText, Landmark, ArrowRight } from "lucide-react";
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrapper";

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
    <section id="services" className="bg-[#faf9f5] py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <MotionReveal direction="up" className="mb-14 max-w-2xl">
          <div className="section-kicker">{t('services.kicker')}</div>
          <h2 className="font-display mb-4 text-4xl tracking-tight text-[#141413] md:text-5xl">
            {t('services.title')}
          </h2>
          <p className="text-lg leading-relaxed text-[#3d3d3a]">
            {t('services.subtitle')}
          </p>
        </MotionReveal>

        <MotionStaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#efe9de] p-8">
                <div className="mb-6 h-6 w-6 animate-pulse rounded bg-[#e6dfd8]" />
                <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-[#e6dfd8]" />
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-[#e6dfd8]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[#e6dfd8]" />
              </div>
            ))
          ) : (
            services?.data?.map((service: Service) => (
              <MotionStaggerItem key={service.id}>
                <ServiceCard name={service.name} icon={service.icon} />
              </MotionStaggerItem>
            ))
          )}
        </MotionStaggerContainer>
      </div>
    </section>
  );
}

function ServiceCard({ name, icon }: { name: string; icon: string }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col h-full rounded-2xl border border-[#e6dfd8]/70 bg-[#efe9de]/80 p-8 shadow-sm backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-[#efe9de] hover:shadow-xl hover:shadow-[#cc785c]/10"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
        {serviceIcons[icon]}
      </div>
      <h3 className="font-display mb-3 text-2xl tracking-tight text-[#141413] group-hover:text-primary transition-colors">
        {t(`services.${name}.title`)}
      </h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-[#3d3d3a]">
        {t(`services.${name}.description`)}
      </p>
      <Link
        href="/registreren"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:translate-x-1"
      >
        <span>{t('services.learnMore')}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
