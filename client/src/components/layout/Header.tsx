import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Header() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${isScrolled ? 'border-slate-200/80 bg-white/95 shadow-sm backdrop-blur' : 'border-transparent bg-white/90 backdrop-blur'}`}>
      <div className="hidden bg-[#082335] py-2 text-center text-xs font-medium text-white/80 md:block">
        Persoonlijke begeleiding voor een goede start in Nederland
      </div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white shadow-lg shadow-primary/20">i</div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-[#082335]">Immigratiepunt</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Jouw start in Nederland</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#services" className="text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-primary">
              {t('header.services')}
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-primary">
              {t('header.howItWorks')}
            </a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-primary">
              {t('header.faq')}
            </a>
            <a href="#register" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90">
              {t('header.register')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            
            <div className="border-l border-slate-200 pl-5">
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mt-4 border-t border-slate-100 bg-white md:hidden">
            <div className="container mx-auto py-3 space-y-3">
              <a 
                href="#services" 
                className="block py-2 text-foreground hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.services')}
              </a>
              <a 
                href="#how-it-works" 
                className="block py-2 text-foreground hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.howItWorks')}
              </a>
              <a 
                href="#faq" 
                className="block py-2 text-foreground hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.faq')}
              </a>
              <a 
                href="#register" 
                className="block py-2 text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.register')}
              </a>
              
              <div className="py-2 border-t border-gray-100">
                <LanguageSwitcher mobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
