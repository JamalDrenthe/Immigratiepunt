import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-hero">
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#services" 
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 text-center"
            >
              {t('hero.servicesButton')}
            </a>
            <a 
              href="#register" 
              className="inline-block bg-white hover:bg-gray-100 text-primary font-medium py-3 px-8 rounded-md transition-colors duration-200 text-center"
            >
              {t('hero.getStartedButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
