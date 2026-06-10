import { Link } from "wouter";
import { ArrowRight, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black pt-32 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Prêt à enseigner <br /> en anglais ?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Rejoignez la plateforme leader en Algérie pour les enseignants et chercheurs du supérieur. Votre première session est offerte.
            </p>
            <a
              href="mailto:contact@teachinenglish.dz"
              className="inline-flex items-center gap-2 text-xl font-medium text-white hover:text-primary transition-colors group"
              data-testid="link-email"
            >
              contact@teachinenglish.dz
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#programme" className="text-muted-foreground hover:text-white transition-colors">Programme</Link></li>
              <li><Link href="#pour-qui" className="text-muted-foreground hover:text-white transition-colors">Pour qui</Link></li>
              <li><Link href="#temoignages" className="text-muted-foreground hover:text-white transition-colors">Témoignages</Link></li>
              <li><Link href="#tarifs" className="text-muted-foreground hover:text-white transition-colors">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Nous suivre</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-linkedin"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-youtube"><Youtube className="w-4 h-4" /> YouTube</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-instagram"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href="mailto:contact@teachinenglish.dz" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-mail"><Mail className="w-4 h-4" /> Email</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <Link href="/" className="font-serif text-xl font-bold tracking-tighter text-white" data-testid="link-footer-logo">
            TeachIn<span className="text-primary">English</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TeachInEnglish. Tous droits réservés. Algérie.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
