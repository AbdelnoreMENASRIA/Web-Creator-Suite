import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#programme" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-programme">
            Programme
          </Link>
          <Link href="#pour-qui" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-pour-qui">
            Pour qui
          </Link>
          <Link href="#temoignages" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-temoignages">
            Témoignages
          </Link>
          <Button variant="default" className="rounded-full bg-white text-black hover:bg-white/90" data-testid="button-nav-cta">
            Réserver une session
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
            Programme
          </Link>
          <Link href="#pour-qui" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Pour qui
          </Link>
          <Link href="#temoignages" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Témoignages
          </Link>
          <Button variant="default" className="w-full mt-4 rounded-none bg-primary text-primary-foreground">
            Réserver une session
          </Button>
        </div>
      )}
    </header>
  );
}
