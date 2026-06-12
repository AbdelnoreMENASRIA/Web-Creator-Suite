import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { Users, User, ArrowRight, Video } from "lucide-react";

export default function ChoisirMode() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-white/5 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="font-serif font-bold text-lg">
            <span className="text-white">TeachIn</span><span className="text-primary">English</span>
          </button>
          <button onClick={() => navigate("/dashboard")} className="text-sm text-muted-foreground hover:text-white transition-colors">
            Mon espace →
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Video className="w-4 h-4" /> Formations en vidéoconférence
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Comment souhaitez-vous<br />vous former ?
            </h1>
            <p className="text-muted-foreground text-lg">
              Bonjour <span className="text-white font-medium">{user.prenom}</span> — choisissez votre mode de formation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* EN GROUPE */}
            <motion.button
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/sessions")}
              className="group text-left rounded-3xl border border-white/10 bg-card p-8 hover:border-primary/40 hover:bg-card/80 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">En groupe</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Rejoignez des sessions collectives animées par des formateurs certifiés. Idéal pour découvrir la plateforme et progresser avec d'autres apprenants de votre domaine.
              </p>
              <div className="space-y-2 mb-8">
                {["Sessions planifiées avec date fixe", "Jusqu'à 50 participants", "Plusieurs spécialités disponibles", "Accès immédiat aux sessions en cours"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{f}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Voir les sessions disponibles <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* INDIVIDUEL */}
            <motion.button
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/trouver-formateur")}
              className="group text-left rounded-3xl border border-white/10 bg-card p-8 hover:border-accent/40 hover:bg-card/80 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <User className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Formation individuelle</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Choisissez votre formateur, envoyez une demande personnalisée. Le formateur propose des créneaux qui vous conviennent.
              </p>
              <div className="space-y-2 mb-8">
                {["Choisissez votre formateur", "Formation adaptée à vos besoins", "Créneaux négociés ensemble", "Suivi personnalisé"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{f}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                Trouver un formateur <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
