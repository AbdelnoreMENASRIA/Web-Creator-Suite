import { Link } from "wouter";
import { ArrowRight, Instagram, Twitter, Linkedin, Dribbble } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black pt-32 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to <br /> defy gravity?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              We partner with visionary brands to create digital experiences that refuse to be ignored.
            </p>
            <a 
              href="mailto:hello@oblivion.agency" 
              className="inline-flex items-center gap-2 text-xl font-medium text-white hover:text-primary transition-colors group"
            >
              hello@oblivion.agency 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#work" className="text-muted-foreground hover:text-white transition-colors">Work</Link></li>
              <li><Link href="#services" className="text-muted-foreground hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#studio" className="text-muted-foreground hover:text-white transition-colors">Studio</Link></li>
              <li><Link href="#careers" className="text-muted-foreground hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Socials</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"><Dribbble className="w-4 h-4" /> Dribbble</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-white">
            OBLIVION<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Oblivion Agency. All rights reserved.
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
