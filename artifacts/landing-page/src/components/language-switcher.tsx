import { useLanguage, type Lang } from "@/contexts/language-context";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 border border-white/10 rounded-full px-1 py-1" data-testid="lang-switcher">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          data-testid={`lang-${code}`}
          className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            lang === code ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
