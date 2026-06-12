import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import {
  Video, Calendar, Clock, Users, GraduationCap, Building2,
  ArrowLeft, ExternalLink, CheckCircle, Loader2, Search,
} from "lucide-react";

interface Session {
  id: string;
  titre: string;
  description: string;
  specialiteCible: string;
  dateSession: string;
  heureDebut: string;
  dureeMinutes: number;
  placesMax: number;
  statut: string;
  inscrits: number;
  formateurId: string;
  formateurPrenom: string | null;
  formateurNom: string | null;
  formateurUniversite: string | null;
  formateurSpecialite: string | null;
}

function statusLabel(s: string) {
  switch (s) {
    case "en_cours": return { label: "En cours", cls: "bg-green-500/20 text-green-400 border-green-500/30" };
    case "planifiee": return { label: "Planifiée", cls: "bg-primary/20 text-primary border-primary/30" };
    case "terminee": return { label: "Terminée", cls: "bg-white/10 text-white/40 border-white/10" };
    case "annulee": return { label: "Annulée", cls: "bg-red-500/20 text-red-400 border-red-400/30" };
    default: return { label: s, cls: "bg-white/10 text-white/40 border-white/10" };
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-DZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function Sessions() {
  const [, navigate] = useLocation();
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [registering, setRegistering] = useState<string | null>(null);
  const [registered, setRegistered] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        if (user && token) {
          for (const s of data.sessions) {
            checkRegistration(s.id);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async (sessionId: string) => {
    if (!token) return;
    const res = await fetch(`/api/sessions/${sessionId}/my-registration`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRegistered((prev) => ({ ...prev, [sessionId]: data.registered }));
    }
  };

  const handleRegister = async (session: Session) => {
    if (!user || !token) { navigate("/auth"); return; }
    if (user.role === "formateur") { return; }
    setRegistering(session.id);
    setFeedback((prev) => ({ ...prev, [session.id]: "" }));
    try {
      const res = await fetch(`/api/sessions/${session.id}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRegistered((prev) => ({ ...prev, [session.id]: true }));
        setFeedback((prev) => ({ ...prev, [session.id]: "✓ Inscrit avec succès" }));
        fetchSessions();
      } else {
        setFeedback((prev) => ({ ...prev, [session.id]: data.error ?? "Erreur" }));
      }
    } finally {
      setRegistering(null);
    }
  };

  const filtered = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.titre.toLowerCase().includes(q) ||
      s.specialiteCible.toLowerCase().includes(q) ||
      (s.formateurNom ?? "").toLowerCase().includes(q) ||
      (s.formateurPrenom ?? "").toLowerCase().includes(q)
    );
  });

  const active = filtered.filter((s) => s.statut === "en_cours");
  const upcoming = filtered.filter((s) => s.statut === "planifiee");
  const past = filtered.filter((s) => s.statut === "terminee" || s.statut === "annulee");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 font-serif font-bold text-lg">
            <span className="text-white">TeachIn</span><span className="text-primary">English</span>
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate("/dashboard")} className="text-sm text-primary hover:underline">
                Mon espace →
              </button>
            ) : (
              <button onClick={() => navigate("/auth")} className="h-9 px-5 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                S'inscrire / Connexion
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Sessions disponibles</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Formations en vidéoconférence
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Rejoignez des sessions animées par des enseignants certifiés du département d'Anglais, adaptées à votre discipline.
          </p>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, spécialité ou formateur..."
            className="w-full h-12 rounded-2xl bg-card border border-white/10 text-white pl-11 pr-4 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-3" /> Chargement des sessions...
          </div>
        ) : (
          <div className="space-y-10">
            {active.length > 0 && (
              <Section title="🔴 En cours maintenant" sessions={active} onRegister={handleRegister}
                registered={registered} registering={registering} feedback={feedback} user={user} navigate={navigate} />
            )}
            {upcoming.length > 0 && (
              <Section title="📅 Sessions à venir" sessions={upcoming} onRegister={handleRegister}
                registered={registered} registering={registering} feedback={feedback} user={user} navigate={navigate} />
            )}
            {active.length === 0 && upcoming.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <Video className="w-14 h-14 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium text-white mb-2">Aucune session disponible</p>
                <p className="text-sm">Les formateurs publieront bientôt leurs prochaines sessions.</p>
              </div>
            )}
            {past.length > 0 && (
              <Section title="Sessions terminées" sessions={past} onRegister={handleRegister}
                registered={registered} registering={registering} feedback={feedback} user={user} navigate={navigate} dim />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, sessions, onRegister, registered, registering, feedback, user, navigate, dim }: {
  title: string; sessions: Session[]; onRegister: (s: Session) => void;
  registered: Record<string, boolean>; registering: string | null;
  feedback: Record<string, string>; user: ReturnType<typeof useAuth>["user"];
  navigate: (p: string) => void; dim?: boolean;
}) {
  return (
    <div className={dim ? "opacity-60" : ""}>
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s, i) => (
          <SessionCard key={s.id} session={s} index={i} onRegister={onRegister}
            isRegistered={registered[s.id] ?? false} isRegistering={registering === s.id}
            feedbackMsg={feedback[s.id] ?? ""} user={user} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

function SessionCard({ session: s, index, onRegister, isRegistered, isRegistering, feedbackMsg, user, navigate }: {
  session: Session; index: number; onRegister: (s: Session) => void;
  isRegistered: boolean; isRegistering: boolean; feedbackMsg: string;
  user: ReturnType<typeof useAuth>["user"]; navigate: (p: string) => void;
}) {
  const st = statusLabel(s.statut);
  const full = s.inscrits >= s.placesMax;
  const isOwner = user?.role === "formateur" && user?.id === s.formateurId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-3xl border border-white/8 bg-card p-6 flex flex-col gap-4 hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium mb-3 ${st.cls}`}>
            {s.statut === "en_cours" && <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
            {st.label}
          </span>
          <h3 className="text-base font-bold text-white leading-snug mb-1">{s.titre}</h3>
          <p className="text-xs text-primary font-medium">Pour les {s.specialiteCible}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Video className="w-5 h-5 text-primary" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{s.description}</p>

      <div className="border-t border-white/5 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{formatDate(s.dateSession)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{s.heureDebut} • {s.dureeMinutes} min</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{s.inscrits}/{s.placesMax} places</span>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-2xl p-3 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {s.formateurPrenom} {s.formateurNom}
            </p>
            <p className="text-xs text-muted-foreground font-mono">{s.formateurId}</p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Building2 className="w-3 h-3 shrink-0" />
              {(s.formateurUniversite ?? "").split(" - ")[0]}
            </p>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <p className={`text-xs ${feedbackMsg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
          {feedbackMsg}
        </p>
      )}

      {s.statut !== "terminee" && s.statut !== "annulee" && !isOwner && (
        isRegistered ? (
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Vous êtes inscrit(e)
          </div>
        ) : (
          <button
            onClick={() => onRegister(s)}
            disabled={full || isRegistering}
            className="w-full h-10 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {full ? "Complet" : !user ? "S'inscrire pour participer" : "Rejoindre cette session"}
          </button>
        )
      )}
    </motion.div>
  );
}
