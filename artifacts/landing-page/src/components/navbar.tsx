import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLanguage, type Lang } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
];

export function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
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
        <Logo />

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

          <LanguageSwitcher />

          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              data-testid="button-nav-cta"
            >
              Mon espace <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/sessions")}
              className="h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              data-testid="button-nav-cta"
            >
              {t.nav.cta} <ArrowRight className="w-4 h-4" />
            </button>
          )}
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
                  lang === code ? "bg-primary border-primary text-white" : "border-white/20 text-muted-foreground hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setMobileMenuOpen(false); navigate(user ? "/dashboard" : "/sessions"); }}
            className="w-full mt-2 h-12 rounded-full bg-white text-black font-medium"
          >
            {user ? "Mon espace" : t.nav.cta}
          </button>
        </div>
      )}
    </header>
  );
}
