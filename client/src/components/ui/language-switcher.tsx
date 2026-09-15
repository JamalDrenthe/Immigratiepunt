import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  // If on mobile, render a simplified version
  if (mobile) {
    return (
      <div className="flex items-center text-sm font-medium space-x-1 hover:text-primary transition-colors duration-200">
        <Globe className="h-5 w-5" />
        <button onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')} className="flex items-center">
          <span id="mobile-current-language">{language.toUpperCase()}</span>
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium space-x-1 hover:text-primary transition-colors duration-200">
          <Globe className="h-5 w-5" />
          <span>{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('nl')}>
          Nederlands
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
