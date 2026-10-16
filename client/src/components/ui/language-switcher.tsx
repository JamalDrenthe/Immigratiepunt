import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SUPPORTED_LANGUAGES = [
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#141413] transition-colors hover:bg-[#efe9de] hover:text-primary ${
            mobile ? "w-full justify-between" : ""
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base">{currentLang.flag}</span>
            <span>{currentLang.code.toUpperCase()}</span>
          </div>
          <Globe className="h-3.5 w-3.5 text-[#6c6a64]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto rounded-xl border-[#e6dfd8] bg-[#faf9f5] p-1.5 shadow-xl">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-[#3d3d3a] hover:bg-[#efe9de] hover:text-[#141413]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
