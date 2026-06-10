import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, type Lang } from "@/contexts/language-context";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
];

export function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tighter text-white" data-testid="link-logo">
          TeachIn<span className="text-primary">English</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#programme" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors whitespace-nowrap" data-testid="link-programme">
            {t.nav.programme}
          </Link>
          <Link href="#pour-qui" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors whitespace-nowrap" data-testid="link-pour-qui">
            {t.nav.pourQui}
          </Link>
          <Link href="#temoignages" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors whitespace-nowrap" data-testid="link-temoignages">
            {t.nav.temoignages}
          </Link>

          <div className="flex items-center gap-0.5 border border-white/10 rounded-full px-1 py-1 shrink-0" data-testid="lang-switcher">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                data-testid={`lang-${code}`}
                className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  lang === code
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button variant="default" size="sm" className="rounded-full bg-white text-black hover:bg-white/90 whitespace-nowrap shrink-0" data-testid="button-nav-cta">
            {t.nav.cta}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-4 shadow-2xl">
          <Link href="#programme" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            {t.nav.programme}
          </Link>
          <Link href="#pour-qui" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            {t.nav.pourQui}
          </Link>
          <Link href="#temoignages" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            {t.nav.temoignages}
          </Link>

          <div className="flex items-center gap-2 pt-2">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  lang === code
                    ? "bg-primary border-primary text-white"
                    : "border-white/20 text-muted-foreground hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button variant="default" className="w-full mt-2 rounded-none bg-primary text-primary-foreground">
            {t.nav.cta}
          </Button>
        </div>
      )}
    </header>
  );
}
