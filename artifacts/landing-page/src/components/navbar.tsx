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
        <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-white" data-testid="link-logo">
          FLUENT<span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-how-it-works">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-testimonials">
            Testimonials
          </Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-about">
            About
          </Link>
          <Button variant="default" className="rounded-full bg-white text-black hover:bg-white/90" data-testid="button-nav-cta">
            Book a Free Session
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
          <Link href="#how-it-works" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </Link>
          <Link href="#testimonials" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Testimonials
          </Link>
          <Link href="#about" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Button variant="default" className="w-full mt-4 rounded-none bg-primary text-primary-foreground">
            Book a Free Session
          </Button>
        </div>
      )}
    </header>
  );
}
