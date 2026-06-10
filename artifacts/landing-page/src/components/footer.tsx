import { Link } from "wouter";
import { ArrowRight, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const NAV_HREFS = ["#programme", "#pour-qui", "#temoignages", "#tarifs"];
const SOCIAL_ICONS = [Linkedin, Youtube, Instagram, Mail];
const SOCIAL_HREFS = ["#", "#", "#", "mailto:contact@teachinenglish.dz"];
const SOCIAL_LABELS = ["LinkedIn", "YouTube", "Instagram", "Email"];
const SOCIAL_TEST_IDS = ["link-linkedin", "link-youtube", "link-instagram", "link-mail"];

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-black pt-32 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 ${isRtl ? "text-right" : ""}`}>
          <div className="lg:col-span-2">
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t.footer.title1} <br /> {t.footer.title2}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">{t.footer.subtitle}</p>
            <a
              href={`mailto:${t.footer.email}`}
              className={`inline-flex items-center gap-2 text-xl font-medium text-white hover:text-primary transition-colors group ${isRtl ? "flex-row-reverse" : ""}`}
              data-testid="link-email"
            >
              {t.footer.email}
              <ArrowRight className={`w-6 h-6 group-hover:translate-x-2 transition-transform ${isRtl ? "rotate-180" : ""}`} />
            </a>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">{t.footer.navTitle}</h4>
            <ul className="flex flex-col gap-4">
              {t.footer.navLinks.map((label, i) => (
                <li key={i}>
                  <Link href={NAV_HREFS[i]} className="text-muted-foreground hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">{t.footer.socialTitle}</h4>
            <ul className="flex flex-col gap-4">
              {SOCIAL_ICONS.map((Icon, i) => (
                <li key={i}>
                  <a
                    href={SOCIAL_HREFS[i]}
                    className={`text-muted-foreground hover:text-white transition-colors flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
                    data-testid={SOCIAL_TEST_IDS[i]}
                  >
                    <Icon className="w-4 h-4" /> {SOCIAL_LABELS[i]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4 ${isRtl ? "md:flex-row-reverse" : ""}`}>
          <Link href="/" className="font-serif text-xl font-bold tracking-tighter text-white" data-testid="link-footer-logo">
            TeachIn<span className="text-primary">English</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
