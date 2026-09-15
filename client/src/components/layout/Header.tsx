import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-primary font-bold text-2xl">Immigratiepunt</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary font-medium transition-colors duration-200">
              {t('header.services')}
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary font-medium transition-colors duration-200">
              {t('header.howItWorks')}
            </a>
            <a href="#faq" className="text-foreground hover:text-primary font-medium transition-colors duration-200">
              {t('header.faq')}
            </a>
            <a href="#register" className="text-white bg-primary hover:bg-primary/90 py-2 px-6 rounded-md font-medium transition-colors duration-200">
              {t('header.register')}
            </a>
            
            <div className="border-l pl-5 border-gray-200">
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 mt-4">
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
