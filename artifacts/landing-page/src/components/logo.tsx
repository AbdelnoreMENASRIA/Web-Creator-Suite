import { Link } from "wouter";

export function Logo() {
  return (
    <Link href="/" className="font-serif text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
      TeachIn<span className="text-primary">English</span>
    </Link>
  );
}
