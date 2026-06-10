import { Link } from "wouter";
import { ArrowRight, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black pt-32 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to speak <br /> with confidence?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Your first live session is completely free. Meet your teacher, speak English, and feel the difference.
            </p>
            <a
              href="mailto:hello@fluent.live"
              className="inline-flex items-center gap-2 text-xl font-medium text-white hover:text-primary transition-colors group"
              data-testid="link-email"
            >
              hello@fluent.live
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#how-it-works" className="text-muted-foreground hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#testimonials" className="text-muted-foreground hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link href="#about" className="text-muted-foreground hover:text-white transition-colors">About</Link></li>
              <li><Link href="#pricing" className="text-muted-foreground hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Follow Us</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-instagram"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-twitter"><Twitter className="w-4 h-4" /> Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-linkedin"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2" data-testid="link-youtube"><Youtube className="w-4 h-4" /> YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-white" data-testid="link-footer-logo">
            FLUENT<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fluent Live. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
