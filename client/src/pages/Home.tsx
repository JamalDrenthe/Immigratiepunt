import { useTranslation } from "react-i18next";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Registration } from "@/components/sections/Registration";
import { Helmet } from "react-helmet";

export default function Home() {
  const { t, i18n } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://immigratiepunt.nl" />
        <meta property="og:locale" content={i18n.language} />
        <meta property="og:site_name" content="Immigratiepunt" />
      </Helmet>
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Registration />
    </>
  );
}
