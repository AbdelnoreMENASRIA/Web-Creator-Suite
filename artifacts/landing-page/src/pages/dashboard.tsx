import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth, AuthUser } from "@/contexts/auth-context";
import {
  GraduationCap, LogOut, Edit3, Save, X, Users, User,
  BookOpen, Building2, Mail, Hash, Calendar, Briefcase, BadgeCheck,
} from "lucide-react";

export default function Dashboard() {
  const { user, token, logout, refreshUser } = useAuth();
  const [, navigate] = useLocation();
  const [editing, setEditing] = useState(false);
  const [apprenants, setApprenants] = useState<Omit<AuthUser, "passwordHash">[]>([]);
  const [loadingApprenants, setLoadingApprenants] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [changePwd, setChangePwd] = useState(false);

  const [form, setForm] = useState({
    prenom: "", nom: "", age: "", universite: "", faculte: "",
    departement: "", specialite: "", numero: "",
    currentPassword: "", newPassword: "", confirmNewPassword: "",
  });

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    setForm({
      prenom: user.prenom, nom: user.nom, age: String(user.age),
      universite: user.universite, faculte: user.faculte,
      departement: user.departement, specialite: user.specialite,
      numero: user.numero, currentPassword: "", newPassword: "", confirmNewPassword: "",
    });
    if (user.role === "formateur") fetchApprenants();
  }, [user]);

  const fetchApprenants = async () => {
    setLoadingApprenants(true);
    try {
      const res = await fetch("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApprenants(data.users);
      }
    } finally {
      setLoadingApprenants(false);
    }
  };

  const handleSave = async () => {
    setSaveError("");
    if (changePwd) {
      if (form.newPassword !== form.confirmNewPassword) {
        setSaveError("Les nouveaux mots de passe ne correspondent pas");
        return;
      }
      if (form.newPassword.length < 8) {
        setSaveError("Le nouveau mot de passe doit comporter au moins 8 caractères");
        return;
      }
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
    setEditing(false);
    setChangePwd(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!user) return null;

  const isFormateur = user.role === "formateur";

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif font-bold text-lg">
            <span className="text-white">TeachIn</span>
            <span className="text-primary">English</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.prenom} {user.nom}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${isFormateur ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
              {isFormateur ? "Formateur" : "Apprenant"}
            </span>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 text-sm"
          >
            <BadgeCheck className="w-4 h-4" /> Profil mis à jour avec succès
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-card p-6 flex flex-col items-center text-center"
          >
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
          </motion.div>

          {/* Profile / Edit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-3xl border border-white/10 bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Mon profil
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Modifier
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setChangePwd(false); setSaveError(""); }}
                    className="flex items-center gap-2 text-sm text-muted-foreground border border-white/10 rounded-full px-4 py-2 hover:bg-white/5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Enregistrer
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {saveError}
              </div>
            )}

            {!editing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileField label="Prénom" value={user.prenom} icon={<User className="w-3.5 h-3.5" />} />
                <ProfileField label="Nom" value={user.nom} icon={<User className="w-3.5 h-3.5" />} />
                <ProfileField label="Université" value={user.universite} icon={<Building2 className="w-3.5 h-3.5" />} />
                <ProfileField label="Faculté" value={user.faculte} icon={<Building2 className="w-3.5 h-3.5" />} />
                <ProfileField label="Département" value={user.departement} icon={<Briefcase className="w-3.5 h-3.5" />} />
                <ProfileField label="Spécialité" value={user.specialite} icon={<BookOpen className="w-3.5 h-3.5" />} />
                <ProfileField label="Rôle" value={isFormateur ? "Formateur" : "Apprenant"} icon={<GraduationCap className="w-3.5 h-3.5" />} />
                <ProfileField label="Inscrit depuis" value={new Date(user.createdAt).toLocaleDateString("fr-DZ", { year: "numeric", month: "long", day: "numeric" })} icon={<Calendar className="w-3.5 h-3.5" />} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <EditField label="Prénom" value={form.prenom} onChange={(v) => setForm(f => ({ ...f, prenom: v }))} />
                  <EditField label="Nom" value={form.nom} onChange={(v) => setForm(f => ({ ...f, nom: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EditField label="Âge" value={form.age} type="number" onChange={(v) => setForm(f => ({ ...f, age: v }))} />
                  <EditField label="Numéro" value={form.numero} onChange={(v) => setForm(f => ({ ...f, numero: v }))} />
                </div>
                <EditField label="Université" value={form.universite} onChange={(v) => setForm(f => ({ ...f, universite: v }))} />
                <div className="grid grid-cols-2 gap-4">
                  <EditField label="Faculté" value={form.faculte} onChange={(v) => setForm(f => ({ ...f, faculte: v }))} />
                  <EditField label="Département" value={form.departement} onChange={(v) => setForm(f => ({ ...f, departement: v }))} />
                </div>
                <EditField label="Spécialité" value={form.specialite} onChange={(v) => setForm(f => ({ ...f, specialite: v }))} />

                <div className="border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setChangePwd(!changePwd)}
                    className="text-sm text-primary hover:underline"
                  >
                    {changePwd ? "▾ Annuler le changement de mot de passe" : "▸ Changer le mot de passe"}
                  </button>
                  {changePwd && (
                    <div className="mt-4 space-y-3">
                      <EditField label="Mot de passe actuel" value={form.currentPassword} type="password" onChange={(v) => setForm(f => ({ ...f, currentPassword: v }))} />
                      <EditField label="Nouveau mot de passe" value={form.newPassword} type="password" onChange={(v) => setForm(f => ({ ...f, newPassword: v }))} />
                      <EditField label="Confirmer le nouveau" value={form.confirmNewPassword} type="password" onChange={(v) => setForm(f => ({ ...f, confirmNewPassword: v }))} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Formateurs: liste des apprenants */}
        {isFormateur && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-3xl border border-white/10 bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Apprenants inscrits
                <span className="text-sm font-normal text-muted-foreground ml-1">({apprenants.length})</span>
              </h3>
              <button onClick={fetchApprenants} className="text-xs text-muted-foreground hover:text-white border border-white/10 rounded-full px-3 py-1.5 transition-colors">
                Actualiser
              </button>
            </div>

            {loadingApprenants ? (
              <p className="text-muted-foreground text-sm">Chargement...</p>
            ) : apprenants.length === 0 ? (
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
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="text-white/30">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function ProfileField({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-background rounded-2xl p-4 border border-white/5">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        {icon} {label}
      </div>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}

function EditField({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none"
      />
    </div>
  );
}
