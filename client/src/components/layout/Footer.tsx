import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Immigratiepunt</h4>
            <p className="text-gray-400 mb-4">{t('footer.about')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
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
            <h4 className="text-xl font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('footer.testimonials')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span className="text-gray-400">Herengracht 341, 1016 AZ Amsterdam</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span className="text-gray-400">info@immigratiepunt.nl</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span className="text-gray-400">+31 (0)20 123 4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Language and Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-400 mr-4">{t('footer.chooseLanguage')}:</span>
            <button 
              onClick={() => setLanguage('en')}
              className={`${language === 'en' ? 'text-white' : 'text-gray-400'} hover:text-primary mx-2 transition-colors duration-200`}
            >
              English
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => setLanguage('nl')}
              className={`${language === 'nl' ? 'text-white' : 'text-gray-400'} hover:text-primary mx-2 transition-colors duration-200`}
            >
              Nederlands
            </button>
          </div>
          <div className="text-gray-400 text-sm">
            <span>{t('footer.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
