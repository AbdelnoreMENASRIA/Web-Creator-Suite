import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import {
  Search, GraduationCap, Building2, BookOpen, X,
  Send, Loader2, ArrowLeft, CheckCircle, User,
} from "lucide-react";

interface Formateur {
  id: string; prenom: string; nom: string;
  universite: string; faculte: string; departement: string; specialite: string;
}

export default function TrouverFormateur() {
  const { user, token } = useAuth();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Formateur[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Formateur | null>(null);
  const [form, setForm] = useState({ sujet: "", message: "", niveauActuel: "", objectif: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.length < 2) { setResults([]); return; }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/formateurs/search?q=${encodeURIComponent(query)}`);
        if (res.ok) { const d = await res.json(); setResults(d.formateurs); }
      } finally { setSearching(false); }
    }, 350);
  }, [query]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError(""); setSending(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ formateurId: selected.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur"); return; }
      setSuccess(true);
    } finally { setSending(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/choisir")} className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-serif font-bold text-lg">
            <span className="text-white">TeachIn</span><span className="text-primary">English</span>
          </div>
          <span className="text-muted-foreground text-sm">/ Trouver un formateur</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Demande envoyée !</h2>
              <p className="text-muted-foreground mb-2">
                Votre demande a été envoyée à <span className="text-white font-medium">{selected?.prenom} {selected?.nom}</span>.
              </p>
              <p className="text-muted-foreground text-sm mb-8">
                Vous recevrez une notification dans votre espace dès que le formateur répondra.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => navigate("/dashboard")}
                  className="h-11 px-6 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                  Voir mes demandes
                </button>
                <button onClick={() => { setSuccess(false); setSelected(null); setForm({ sujet: "", message: "", niveauActuel: "", objectif: "" }); setQuery(""); }}
                  className="h-11 px-6 border border-white/10 text-muted-foreground rounded-full text-sm hover:text-white hover:border-white/30 transition-colors">
                  Nouvelle demande
                </button>
              </div>
            </motion.div>
          ) : !selected ? (
            <motion.div key="search" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Formation individuelle</p>
              <h1 className="text-4xl font-serif font-bold text-white mb-2">Trouver votre formateur</h1>
              <p className="text-muted-foreground mb-8">Recherchez par nom ou université. Seuls les enseignants du département d'Anglais sont formateurs.</p>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />}
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom du formateur, université..."
                  autoFocus
                  className="w-full h-13 rounded-2xl bg-card border border-white/10 text-white pl-11 pr-4 py-4 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30"
                />
              </div>

              <AnimatePresence>
                {query.length >= 2 && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {results.length === 0 && !searching ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-white mb-1">Aucun formateur trouvé</p>
                        <p className="text-sm">Essayez un autre nom ou université.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {results.map((f, i) => (
                          <motion.button
                            key={f.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelected(f)}
                            className="w-full text-left rounded-2xl border border-white/8 bg-card p-5 hover:border-primary/40 hover:bg-card/80 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                                <GraduationCap className="w-6 h-6 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold">{f.prenom} {f.nom}</p>
                                <p className="text-xs font-mono text-primary">{f.id}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{f.universite.split(" - ")[0]}</span>
                                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{f.specialite}</span>
                                </div>
                              </div>
                              <div className="text-primary text-xs font-medium shrink-0 group-hover:translate-x-1 transition-transform">
                                Choisir →
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
                {query.length < 2 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-15" />
                    <p className="text-sm">Tapez au moins 2 caractères pour rechercher</p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Changer de formateur
              </button>

              {/* Formateur card */}
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold">{selected.prenom} {selected.nom}</p>
                  <p className="text-xs font-mono text-accent">{selected.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />{selected.universite.split(" - ")[0]} • {selected.specialite}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">Votre demande de formation</h2>

              {error && (
                <div className="mb-5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>
              )}

              <form onSubmit={handleSend} className="space-y-5">
                <Field label="Sujet de la formation *" value={form.sujet}
                  onChange={(v) => setForm(f => ({ ...f, sujet: v }))}
                  placeholder="Ex: Améliorer ma rédaction d'articles scientifiques en anglais" required />

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Message au formateur *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Expliquez vos besoins, votre contexte (thèse, publication, cours...) et ce que vous souhaitez améliorer..."
                    required minLength={10} rows={5}
                    className="w-full rounded-xl bg-card border border-white/10 text-white px-4 py-3 text-sm focus:border-primary/50 focus:outline-none resize-none placeholder:text-white/30"
                  />
                </div>

                <Field label="Votre niveau actuel en anglais" value={form.niveauActuel}
                  onChange={(v) => setForm(f => ({ ...f, niveauActuel: v }))}
                  placeholder="Ex: A2, B1, débutant, intermédiaire..." />

                <Field label="Objectif principal" value={form.objectif}
                  onChange={(v) => setForm(f => ({ ...f, objectif: v }))}
                  placeholder="Ex: Soutenir ma thèse en anglais, publier dans une revue internationale..." />

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={sending || !form.sujet || !form.message}
                    className="flex items-center gap-2 h-12 px-8 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Envoyer la demande
                  </button>
                  <button type="button" onClick={() => navigate("/choisir")}
                    className="h-12 px-6 border border-white/10 text-muted-foreground rounded-full text-sm hover:text-white hover:border-white/30 transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full h-11 rounded-xl bg-card border border-white/10 text-white px-4 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30" />
    </div>
  );
}
