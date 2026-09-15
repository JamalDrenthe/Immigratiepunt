import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="bg-[#082335] pb-8 pt-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-lg font-extrabold text-[#082335]">i</div>
              <h4 className="text-xl font-extrabold">Immigratiepunt</h4>
            </div>
            <p className="mb-4 max-w-xs leading-7 text-white/60">{t('footer.about')}</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-white/50 transition-colors hover:text-accent">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/50 transition-colors hover:text-accent">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/50 transition-colors hover:text-accent">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/50 transition-colors hover:text-accent">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Services */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/50">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li>
                  <a href="#services" className="text-white/65 transition-colors duration-200 hover:text-accent">
                  {t('services.banking.title')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('services.housing.title')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('services.employment.title')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('services.administrative.title')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/50">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                  <a href="#register" className="text-white/65 transition-colors duration-200 hover:text-accent">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                  <a href="#faq" className="text-white/65 transition-colors duration-200 hover:text-accent">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                  <a href="#testimonials" className="text-white/65 transition-colors duration-200 hover:text-accent">
                  {t('footer.testimonials')}
                </a>
              </li>
              <li>
                  <a href="#register" className="text-white/65 transition-colors duration-200 hover:text-accent">
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                  <a href="#register" className="text-white/65 transition-colors duration-200 hover:text-accent">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/50">{t('footer.contactUs')}</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-0.5 h-5 w-5 text-accent" />
                <span className="text-white/65">Herengracht 341, 1016 AZ Amsterdam</span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-2 mt-0.5 h-5 w-5 text-accent" />
                <span className="text-white/65">info@immigratiepunt.nl</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 mt-0.5 h-5 w-5 text-accent" />
                <span className="text-white/65">+31 (0)20 123 4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Language and Copyright */}
        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="mr-4 text-white/45">{t('footer.chooseLanguage')}:</span>
            <button 
              onClick={() => setLanguage('en')}
              className={`${language === 'en' ? 'text-white' : 'text-white/45'} mx-2 transition-colors duration-200 hover:text-accent`}
            >
              English
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => setLanguage('nl')}
              className={`${language === 'nl' ? 'text-white' : 'text-white/45'} mx-2 transition-colors duration-200 hover:text-accent`}
            >
              Nederlands
            </button>
          </div>
          <div className="text-sm text-white/45">
            <span>{t('footer.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
