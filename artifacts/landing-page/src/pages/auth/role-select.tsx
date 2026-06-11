import { motion } from "framer-motion";
import { GraduationCap, BookOpen, ArrowRight, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function RoleSelect() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
          <GraduationCap className="w-4 h-4" />
          TeachInEnglish
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Bienvenue sur la plateforme
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Choisissez votre rôle pour commencer
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group rounded-3xl border border-white/10 bg-card p-8 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          onClick={() => navigate("/auth/register?role=apprenant")}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Je veux apprendre</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Enseignant, doctorant ou personnel universitaire souhaitant maîtriser l'anglais académique et professionnel.
          </p>
          <div className="flex flex-col gap-3">
            <button
              className="w-full h-12 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); navigate("/auth/register?role=apprenant"); }}
            >
              S'inscrire <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="w-full h-12 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); navigate("/auth/login?role=apprenant"); }}
            >
              Se connecter <LogIn className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="group rounded-3xl border border-white/10 bg-card p-8 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer"
          onClick={() => navigate("/auth/register?role=formateur")}
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
            <GraduationCap className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Je suis formateur</h2>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            Enseignant du département d'Anglais souhaitant dispenser des formations en vidéoconférence.
          </p>
          <div className="text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2 mb-4">
            Réservé aux enseignants du Département d'Anglais uniquement
          </div>
          <div className="flex flex-col gap-3">
            <button
              className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); navigate("/auth/register?role=formateur"); }}
            >
              S'inscrire <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="w-full h-12 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); navigate("/auth/login?role=formateur"); }}
            >
              Se connecter <LogIn className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate("/")}
        className="mt-10 text-muted-foreground hover:text-white transition-colors text-sm relative z-10"
      >
        ← Retour à l'accueil
      </motion.button>
    </div>
  );
}
