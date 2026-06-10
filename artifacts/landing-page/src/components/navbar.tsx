import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
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
        <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-white">
          OBLIVION<span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#work" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Work
          </Link>
          <Link href="#services" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Services
          </Link>
          <Link href="#studio" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Studio
          </Link>
          <Button variant="default" className="rounded-full bg-white text-black hover:bg-white/90">
            Let's Talk
          </Button>
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-4 shadow-2xl">
          <Link href="#work" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Work
          </Link>
          <Link href="#services" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Services
          </Link>
          <Link href="#studio" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Studio
          </Link>
          <Button variant="default" className="w-full mt-4 rounded-none bg-primary text-primary-foreground">
            Let's Talk
          </Button>
        </div>
      )}
    </header>
  );
}
