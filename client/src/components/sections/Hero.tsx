import { useTranslation } from "react-i18next";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 lg:py-36">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Betrouwbare ondersteuning, stap voor stap
          </div>
          <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="mb-9 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#services" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-center font-bold text-[#082335] shadow-xl shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              {t('hero.servicesButton')}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a 
              href="#register" 
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-center font-bold text-white backdrop-blur transition-all duration-200 hover:bg-white hover:text-[#082335]"
            >
              {t('hero.getStartedButton')}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/70">
            {["Persoonlijk advies", "Nederlands & Engels", "Veilig en transparant"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full border-[32px] border-accent/20" />
    </section>
  );
}
