import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth, AuthUser } from "@/contexts/auth-context";
import {
  GraduationCap, LogOut, Edit3, Save, X, Users, User,
  BookOpen, Building2, Mail, Hash, Calendar, Briefcase, BadgeCheck,
  Video, Plus, Play, StopCircle, Trash2, Clock, ExternalLink, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";

interface Session {
  id: string; titre: string; description: string; specialiteCible: string;
  dateSession: string; heureDebut: string; dureeMinutes: number;
  lienVideo?: string; placesMax: number; statut: string; inscrits: number;
  formateurId: string; formateurPrenom?: string; formateurNom?: string;
  formateurUniversite?: string;
}

interface Reg {
  id: string; prenom: string | null; nom: string | null; email: string | null;
  universite: string | null; specialite: string | null; typeCompte: string | null;
  apprenantId: string | null; registeredAt: string;
}

type Tab = "profil" | "sessions" | "apprenants";

export default function Dashboard() {
  const { user, token, logout, refreshUser } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [editing, setEditing] = useState(false);
  const [apprenants, setApprenants] = useState<Omit<AuthUser, "passwordHash">[]>([]);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [changePwd, setChangePwd] = useState(false);

  const [form, setForm] = useState({
    prenom: "", nom: "", age: "", universite: "", faculte: "",
    departement: "", specialite: "", numero: "",
    currentPassword: "", newPassword: "", confirmNewPassword: "",
  });

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    titre: "", description: "", specialiteCible: "", dateSession: "",
    heureDebut: "", dureeMinutes: "90", lienVideo: "", placesMax: "50",
  });
  const [creatingSession, setCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sessionRegs, setSessionRegs] = useState<Record<string, Reg[]>>({});

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    setForm({
      prenom: user.prenom, nom: user.nom, age: String(user.age),
      universite: user.universite, faculte: user.faculte,
      departement: user.departement, specialite: user.specialite,
      numero: user.numero, currentPassword: "", newPassword: "", confirmNewPassword: "",
    });
    if (user.role === "formateur") fetchSessions();
    if (user.role === "formateur") setActiveTab("sessions");
    fetchApprenants();
  }, [user]);

  const fetchApprenants = async () => {
    if (!token || user?.role !== "formateur") return;
    const res = await fetch("/api/auth/users", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setApprenants(d.users); }
  };

  const fetchSessions = async () => {
    if (!token) return;
    setLoadingSessions(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions.filter((s: Session) => s.formateurId === user?.id));
      }
    } finally { setLoadingSessions(false); }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError("");
    setCreatingSession(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...sessionForm,
          dureeMinutes: parseInt(sessionForm.dureeMinutes),
          placesMax: parseInt(sessionForm.placesMax),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSessionError(data.error ?? "Erreur"); return; }
      setShowCreateForm(false);
      setSessionForm({ titre: "", description: "", specialiteCible: "", dateSession: "", heureDebut: "", dureeMinutes: "90", lienVideo: "", placesMax: "50" });
      fetchSessions();
    } finally { setCreatingSession(false); }
  };

  const startSession = async (id: string) => {
    const res = await fetch(`/api/sessions/${id}/start`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      fetchSessions();
      if (data.lienVideo) window.open(data.lienVideo, "_blank");
    }
  };

  const endSession = async (id: string) => {
    await fetch(`/api/sessions/${id}/end`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    fetchSessions();
  };

  const deleteSession = async (id: string) => {
    if (!confirm("Supprimer cette session ?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchSessions();
  };

  const toggleSessionRegs = async (id: string) => {
    if (expandedSession === id) { setExpandedSession(null); return; }
    setExpandedSession(id);
    if (!sessionRegs[id]) {
      const res = await fetch(`/api/sessions/${id}/registrations`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setSessionRegs((p) => ({ ...p, [id]: d.registrations })); }
    }
  };

  const handleSave = async () => {
    setSaveError("");
    if (changePwd && form.newPassword !== form.confirmNewPassword) {
      setSaveError("Les nouveaux mots de passe ne correspondent pas"); return;
    }
    const payload: Record<string, string | number> = {
      prenom: form.prenom, nom: form.nom, age: parseInt(form.age),
      universite: form.universite, faculte: form.faculte,
      departement: form.departement, specialite: form.specialite, numero: form.numero,
    };
    if (changePwd && form.newPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setSaveError(data.error ?? "Erreur"); return; }
    await refreshUser();
    setEditing(false); setChangePwd(false); setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!user) return null;
  const isFormateur = user.role === "formateur";

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    ...(isFormateur ? [{ id: "sessions" as Tab, label: "Mes sessions", icon: <Video className="w-4 h-4" /> }] : []),
    { id: "profil", label: "Mon profil", icon: <User className="w-4 h-4" /> },
    ...(isFormateur ? [{ id: "apprenants" as Tab, label: "Apprenants", icon: <Users className="w-4 h-4" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif font-bold text-lg">
            <span className="text-white">TeachIn</span><span className="text-primary">English</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${isFormateur ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
              {isFormateur ? "Formateur" : "Apprenant"} • {user.id}
            </span>
            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 text-sm">
            <BadgeCheck className="w-4 h-4" /> Profil mis à jour avec succès
          </motion.div>
        )}

        <div className="flex gap-2 mb-8 border-b border-white/5 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-white"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "sessions" && isFormateur && (
            <motion.div key="sessions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Mes sessions vidéo</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center gap-2 h-10 px-5 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Créer une session
                </button>
              </div>

              <AnimatePresence>
                {showCreateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
                      <h3 className="text-lg font-bold text-white mb-5">Nouvelle session</h3>
                      {sessionError && (
                        <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{sessionError}</div>
                      )}
                      <form onSubmit={handleCreateSession} className="space-y-4">
                        <EF label="Titre de la session" value={sessionForm.titre} onChange={(v) => setSessionForm(f => ({ ...f, titre: v }))} placeholder="Ex: Rédaction académique en anglais pour les mathématiciens" required />
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-1.5">Description</label>
                          <textarea
                            value={sessionForm.description}
                            onChange={(e) => setSessionForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Décrivez le contenu, les objectifs et les prérequis de la session..."
                            required
                            rows={3}
                            className="w-full rounded-xl bg-background border border-white/10 text-white px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none resize-none"
                          />
                        </div>
                        <EF label="Spécialité ciblée (public cible)" value={sessionForm.specialiteCible} onChange={(v) => setSessionForm(f => ({ ...f, specialiteCible: v }))} placeholder="Ex: Mathématiques, Biologie, Informatique..." required />
                        <div className="grid grid-cols-2 gap-4">
                          <EF label="Date" value={sessionForm.dateSession} type="date" onChange={(v) => setSessionForm(f => ({ ...f, dateSession: v }))} required />
                          <EF label="Heure de début" value={sessionForm.heureDebut} type="time" onChange={(v) => setSessionForm(f => ({ ...f, heureDebut: v }))} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <EF label="Durée (minutes)" value={sessionForm.dureeMinutes} type="number" onChange={(v) => setSessionForm(f => ({ ...f, dureeMinutes: v }))} placeholder="90" />
                          <EF label="Places max" value={sessionForm.placesMax} type="number" onChange={(v) => setSessionForm(f => ({ ...f, placesMax: v }))} placeholder="50" />
                        </div>
                        <EF label="Lien vidéoconférence (Zoom / Google Meet / Teams)" value={sessionForm.lienVideo} type="url" onChange={(v) => setSessionForm(f => ({ ...f, lienVideo: v }))} placeholder="https://zoom.us/j/..." required />
                        <div className="flex gap-3 pt-2">
                          <button type="submit" disabled={creatingSession}
                            className="flex items-center gap-2 h-10 px-6 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 disabled:opacity-50">
                            {creatingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Créer
                          </button>
                          <button type="button" onClick={() => setShowCreateForm(false)}
                            className="h-10 px-6 border border-white/10 text-muted-foreground rounded-full text-sm hover:text-white hover:border-white/30 transition-colors">
                            Annuler
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loadingSessions ? (
                <div className="flex items-center gap-3 text-muted-foreground py-10"><Loader2 className="w-5 h-5 animate-spin" /> Chargement...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground rounded-3xl border border-white/5 bg-card">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-white mb-1">Aucune session créée</p>
                  <p className="text-sm">Créez votre première session de formation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((s) => {
                    const regs = sessionRegs[s.id];
                    const isExpanded = expandedSession === s.id;
                    return (
                      <div key={s.id} className="rounded-3xl border border-white/8 bg-card overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <StatusBadge statut={s.statut} />
                                <span className="text-xs text-muted-foreground font-mono">{s.id}</span>
                              </div>
                              <h3 className="text-base font-bold text-white mb-1">{s.titre}</h3>
                              <p className="text-xs text-primary">Pour : {s.specialiteCible}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.dateSession}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.heureDebut}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.inscrits}/{s.placesMax}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                              {s.statut === "planifiee" && (
                                <button onClick={() => startSession(s.id)}
                                  className="flex items-center gap-1.5 h-9 px-4 bg-green-500 text-white rounded-full text-xs font-medium hover:bg-green-400 transition-colors">
                                  <Play className="w-3.5 h-3.5" /> Démarrer
                                </button>
                              )}
                              {s.statut === "en_cours" && (
                                <>
                                  <a href={s.lienVideo} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/80 transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" /> Ouvrir
                                  </a>
                                  <button onClick={() => endSession(s.id)}
                                    className="flex items-center gap-1.5 h-9 px-4 border border-white/20 text-muted-foreground rounded-full text-xs hover:text-white hover:border-white/40 transition-colors">
                                    <StopCircle className="w-3.5 h-3.5" /> Terminer
                                  </button>
                                </>
                              )}
                              <button onClick={() => toggleSessionRegs(s.id)}
                                className="flex items-center gap-1.5 h-9 px-4 border border-white/10 text-muted-foreground rounded-full text-xs hover:text-white transition-colors">
                                <Users className="w-3.5 h-3.5" />
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                              {s.statut !== "en_cours" && (
                                <button onClick={() => deleteSession(s.id)}
                                  className="h-9 w-9 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-white/5">
                              <div className="p-5">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                  Inscrits ({regs?.length ?? "..."})
                                </p>
                                {!regs ? (
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</div>
                                ) : regs.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">Aucun inscrit pour l'instant</p>
                                ) : (
                                  <div className="space-y-2">
                                    {regs.map((r) => (
                                      <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                        <div>
                                          <p className="text-sm text-white font-medium">{r.prenom} {r.nom}</p>
                                          <p className="text-xs text-muted-foreground">{r.email} • {r.specialite}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${r.typeCompte === "doctorant" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                                          {r.typeCompte}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "profil" && (
            <motion.div key="profil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="rounded-3xl border border-white/10 bg-card p-6 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${isFormateur ? "bg-accent/20" : "bg-primary/20"}`}>
                    {isFormateur ? <GraduationCap className="w-10 h-10 text-accent" /> : <BookOpen className="w-10 h-10 text-primary" />}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{user.prenom} {user.nom}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{user.specialite}</p>
                  <div className="w-full bg-background rounded-2xl p-3 border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Identifiant unique</p>
                    <p className="font-mono text-primary font-bold text-lg">{user.id}</p>
                  </div>
                  <div className="mt-4 w-full space-y-2 text-left">
                    <InfoRow icon={<Mail className="w-3.5 h-3.5" />} value={user.email} />
                    <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} value={`${user.age} ans`} />
                    <InfoRow icon={<Hash className="w-3.5 h-3.5" />} value={`${user.typeCompte === "doctorant" ? "Doctorant" : "Enseignant"} • ${user.numero}`} />
                  </div>
                </div>

                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Mon profil</h3>
                    {!editing ? (
                      <button onClick={() => setEditing(true)}
                        className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" /> Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(false); setChangePwd(false); setSaveError(""); }}
                          className="flex items-center gap-2 text-sm text-muted-foreground border border-white/10 rounded-full px-4 py-2 hover:bg-white/5 transition-colors">
                          <X className="w-3.5 h-3.5" /> Annuler
                        </button>
                        <button onClick={handleSave}
                          className="flex items-center gap-2 text-sm bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors">
                          <Save className="w-3.5 h-3.5" /> Enregistrer
                        </button>
                      </div>
                    )}
                  </div>
                  {saveError && <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{saveError}</div>}
                  {!editing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <PF label="Prénom" value={user.prenom} icon={<User className="w-3.5 h-3.5" />} />
                      <PF label="Nom" value={user.nom} icon={<User className="w-3.5 h-3.5" />} />
                      <PF label="Université" value={user.universite} icon={<Building2 className="w-3.5 h-3.5" />} />
                      <PF label="Faculté" value={user.faculte} icon={<Building2 className="w-3.5 h-3.5" />} />
                      <PF label="Département" value={user.departement} icon={<Briefcase className="w-3.5 h-3.5" />} />
                      <PF label="Spécialité" value={user.specialite} icon={<BookOpen className="w-3.5 h-3.5" />} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <EF label="Prénom" value={form.prenom} onChange={(v) => setForm(f => ({ ...f, prenom: v }))} />
                        <EF label="Nom" value={form.nom} onChange={(v) => setForm(f => ({ ...f, nom: v }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <EF label="Âge" value={form.age} type="number" onChange={(v) => setForm(f => ({ ...f, age: v }))} />
                        <EF label="Numéro" value={form.numero} onChange={(v) => setForm(f => ({ ...f, numero: v }))} />
                      </div>
                      <EF label="Université" value={form.universite} onChange={(v) => setForm(f => ({ ...f, universite: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <EF label="Faculté" value={form.faculte} onChange={(v) => setForm(f => ({ ...f, faculte: v }))} />
                        <EF label="Département" value={form.departement} onChange={(v) => setForm(f => ({ ...f, departement: v }))} />
                      </div>
                      <EF label="Spécialité" value={form.specialite} onChange={(v) => setForm(f => ({ ...f, specialite: v }))} />
                      <div className="border-t border-white/5 pt-4">
                        <button type="button" onClick={() => setChangePwd(!changePwd)} className="text-sm text-primary hover:underline">
                          {changePwd ? "▾ Annuler le changement" : "▸ Changer le mot de passe"}
                        </button>
                        {changePwd && (
                          <div className="mt-4 space-y-3">
                            <EF label="Mot de passe actuel" value={form.currentPassword} type="password" onChange={(v) => setForm(f => ({ ...f, currentPassword: v }))} />
                            <EF label="Nouveau mot de passe" value={form.newPassword} type="password" onChange={(v) => setForm(f => ({ ...f, newPassword: v }))} />
                            <EF label="Confirmer" value={form.confirmNewPassword} type="password" onChange={(v) => setForm(f => ({ ...f, confirmNewPassword: v }))} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "apprenants" && isFormateur && (
            <motion.div key="apprenants" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-3xl border border-white/10 bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" /> Apprenants inscrits
                    <span className="text-sm font-normal text-muted-foreground ml-1">({apprenants.length})</span>
                  </h3>
                </div>
                {apprenants.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun apprenant inscrit pour l'instant</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b border-white/5">
                          <th className="text-left pb-3 font-medium">ID</th>
                          <th className="text-left pb-3 font-medium">Nom</th>
                          <th className="text-left pb-3 font-medium hidden md:table-cell">Université</th>
                          <th className="text-left pb-3 font-medium hidden lg:table-cell">Spécialité</th>
                          <th className="text-left pb-3 font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {apprenants.map((a) => (
                          <tr key={a.id} className="hover:bg-white/3 transition-colors">
                            <td className="py-3 font-mono text-xs text-primary">{a.id}</td>
                            <td className="py-3 text-white font-medium">{a.prenom} {a.nom}</td>
                            <td className="py-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">{a.universite.split(" - ")[0]}</td>
                            <td className="py-3 text-muted-foreground hidden lg:table-cell">{a.specialite}</td>
                            <td className="py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${a.typeCompte === "doctorant" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                                {a.typeCompte}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ statut }: { statut: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    planifiee: { label: "Planifiée", cls: "bg-primary/20 text-primary border-primary/30" },
    en_cours: { label: "En cours", cls: "bg-green-500/20 text-green-400 border-green-500/30" },
    terminee: { label: "Terminée", cls: "bg-white/10 text-white/40 border-white/10" },
    annulee: { label: "Annulée", cls: "bg-red-500/20 text-red-400 border-red-400/30" },
  };
  const s = map[statut] ?? map["planifiee"];
  return <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${s.cls}`}>{s.label}</span>;
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="text-white/30">{icon}</span><span className="truncate">{value}</span>
    </div>
  );
}

function PF({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-background rounded-2xl p-4 border border-white/5">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">{icon} {label}</div>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}

function EF({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full h-10 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30" />
    </div>
  );
}
