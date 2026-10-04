import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="bg-[#181715] pb-8 pt-16 text-[#a09d96]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo inverted />
            </div>
            <p className="mb-4 max-w-xs text-sm leading-6">{t('footer.about')}</p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#services" className="transition-colors hover:text-[#faf9f5]">{t('services.banking.title')}</a></li>
              <li><a href="/#services" className="transition-colors hover:text-[#faf9f5]">{t('services.housing.title')}</a></li>
              <li><a href="/#services" className="transition-colors hover:text-[#faf9f5]">{t('services.employment.title')}</a></li>
              <li><a href="/#services" className="transition-colors hover:text-[#faf9f5]">{t('services.administrative.title')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help-mee" className="transition-colors hover:text-[#faf9f5]">{t('header.helpMee')}</Link></li>
              <li><a href="/#faq" className="transition-colors hover:text-[#faf9f5]">{t('footer.faq')}</a></li>
              <li><a href="/#testimonials" className="transition-colors hover:text-[#faf9f5]">{t('footer.testimonials')}</a></li>
              <li><Link href="/registreren" className="transition-colors hover:text-[#faf9f5]">{t('header.register')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-0.5 h-4 w-4 text-primary" />
                <span>Herengracht 341, 1016 AZ Amsterdam</span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-2 mt-0.5 h-4 w-4 text-primary" />
                <span>info@immigratiepunt.nl</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 mt-0.5 h-4 w-4 text-primary" />
                <span>+31 (0)20 123 4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <div className="mb-4 flex items-center md:mb-0">
            <span className="mr-4 text-sm text-[#6c6a64]">{t('footer.chooseLanguage')}:</span>
            <button
              onClick={() => setLanguage('en')}
              className={`mx-2 text-sm transition-colors hover:text-[#faf9f5] ${language === 'en' ? 'text-[#faf9f5]' : 'text-[#6c6a64]'}`}
            >
              English
            </button>
            <span className="text-[#3d3d3a]">|</span>
            <button
              onClick={() => setLanguage('nl')}
              className={`mx-2 text-sm transition-colors hover:text-[#faf9f5] ${language === 'nl' ? 'text-[#faf9f5]' : 'text-[#6c6a64]'}`}
            >
              Nederlands
            </button>
          </div>
          <div className="text-sm text-[#6c6a64]">
            <span>{t('footer.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
