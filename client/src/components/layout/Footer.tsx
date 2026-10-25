import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { MapPin, Mail, ArrowRight, MessageSquare } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SUPPORTED_LANGUAGES } from "@/components/ui/language-switcher";

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
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Stuur ons een bericht</span>
              </Link>
            </div>
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
              <li><Link href="/over-ons" className="transition-colors hover:text-[#faf9f5]">{t('header.about', 'Over ons')}</Link></li>
              <li><Link href="/vacatures" className="transition-colors hover:text-[#faf9f5] flex items-center gap-1.5"><span>Vacatures</span><span className="rounded bg-white/10 text-stone-300 text-[10px] px-1.5 py-0.2">100% Remote</span></Link></li>
              <li><Link href="/help-mee" className="transition-colors hover:text-[#faf9f5]">{t('header.helpMee')}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[#faf9f5]">{t('header.contact', 'Contact')}</Link></li>
              <li><Link href="/registreren" className="transition-colors hover:text-[#faf9f5]">{t('header.register')}</Link></li>
              <li><a href="/#faq" className="transition-colors hover:text-[#faf9f5]">{t('footer.faq')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c6a64]">{t('footer.contact', 'Contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Mail className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@immigratiepunt.nl" className="hover:text-white transition-colors">info@immigratiepunt.nl</a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#faf9f5] hover:bg-white/10 transition-colors"
                >
                  <span>Stel een vraag</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Multilingual Selector Bar */}
        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 gap-4 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs">
            <span className="text-[#6c6a64] font-medium">{t('footer.chooseLanguage')}:</span>
            {SUPPORTED_LANGUAGES.map((lang, idx) => {
              const isCurrent = language === lang.code;
              return (
                <div key={lang.code} className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-1 transition-colors ${
                      isCurrent
                        ? "text-[#faf9f5] font-bold underline underline-offset-4 decoration-primary"
                        : "text-[#6c6a64] hover:text-[#faf9f5]"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                  {idx < SUPPORTED_LANGUAGES.length - 1 && (
                    <span className="text-[#3d3d3a] hidden sm:inline">·</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-xs text-[#6c6a64]">
            <span>{t('footer.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
