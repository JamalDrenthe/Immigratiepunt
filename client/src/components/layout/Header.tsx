import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/Logo";

export function Header() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/#services", label: t('header.services'), page: "/" },
    { href: "/help-mee", label: t('header.helpMee'), page: "/help-mee" },
    { href: "/#how-it-works", label: t('header.howItWorks'), page: "/" },
    { href: "/#faq", label: t('header.faq'), page: "/" },
  ];

  const isActive = (item: { href: string; page: string }) =>
    item.href.startsWith("/#") ? false : location === item.page;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6dfd8] bg-[#faf9f5]/95 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) =>
            item.href.startsWith("/#") ? (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#6c6a64] transition-colors hover:text-[#141413]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#141413] ${
                  isActive(item) ? "text-[#141413]" : "text-[#6c6a64]"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/registreren"
            className="ml-1 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]"
          >
            {t('header.register')}
          </Link>
          <div className="border-l border-[#e6dfd8] pl-4">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#e6dfd8] bg-[#faf9f5] md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {navItems.map((item) =>
              item.href.startsWith("/#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#3d3d3a] hover:bg-[#efe9de]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#3d3d3a] hover:bg-[#efe9de]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href="/registreren"
              className="mt-2 block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('header.register')}
            </Link>
            <div className="border-t border-[#e6dfd8] pt-3">
              <LanguageSwitcher mobile={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
