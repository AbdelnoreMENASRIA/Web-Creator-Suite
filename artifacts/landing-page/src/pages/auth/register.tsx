import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { apiCallJson } from "@/lib/api-client";

const ALGERIAN_UNIVERSITIES = [
  "USTHB - Université des Sciences et de la Technologie Houari Boumediene",
  "Université d'Alger 1 - Benyoucef Benkhedda",
  "Université d'Alger 2 - Abou El Kacem Saadallah",
  "Université d'Alger 3",
  "Université d'Oran 1 Ahmed Ben Bella",
  "Université d'Oran 2 Mohamed Ben Ahmed",
  "Université de Constantine 1 - Frères Mentouri",
  "Université de Constantine 2 - Abdelhamid Mehri",
  "Université de Constantine 3 - Salah Boubnider",
  "Université Abderrahmane Mira de Béjaïa",
  "Université A. Mira de Béjaïa",
  "Université de Tlemcen - Abou Bekr Belkaid",
  "Université Ferhat Abbas de Sétif 1",
  "Université El Hadj Lakhdar de Batna 1",
  "Université de Annaba - Badji Mokhtar",
  "Université de Blida 1 - Saad Dahlab",
  "Université de Blida 2 - Lounici Ali",
  "Université de Biskra - Mohamed Khider",
  "Université de Jijel - Mohamed Seddik Benyahia",
  "Université de Skikda - 20 Août 1955",
  "Université de Msila - Mohamed Boudiaf",
  "Université de Guelma - 8 Mai 1945",
  "Université de Tiaret - Ibn Khaldoun",
  "Université de Tizi Ouzou - Mouloud Mammeri",
  "Université de Sidi Bel Abbès - Djillali Liabes",
  "Université de Médéa",
  "Université de Mostaganem - Abdelhamid Ibn Badis",
  "Université de Ouargla - Kasdi Merbah",
  "Université de Souk Ahras",
  "Université de Khenchela",
  "Autre université",
];

export default function Register() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const role = (params.get("role") ?? "apprenant") as "apprenant" | "formateur";
  const [, navigate] = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    age: "",
    typeCompte: "enseignant" as "doctorant" | "enseignant",
    numero: "",
    universite: "",
    faculte: "",
    departement: "",
    email: "",
    specialite: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit comporter au moins 8 caractères");
      return;
    }
    setLoading(true);
    try {
      const data = await apiCallJson("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          role,
          prenom: form.prenom,
          nom: form.nom,
          age: parseInt(form.age),
          typeCompte: form.typeCompte,
          numero: form.numero,
          universite: form.universite,
          faculte: form.faculte,
          departement: form.departement,
          email: form.email,
          specialite: form.specialite,
          password: form.password,
        }),
      });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  };

  const isFormateur = role === "formateur";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="rounded-3xl border border-white/10 bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFormateur ? "bg-accent/20" : "bg-primary/20"}`}>
              <GraduationCap className={`w-5 h-5 ${isFormateur ? "text-accent" : "text-primary"}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isFormateur ? "Inscription Formateur" : "Inscription Apprenant"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isFormateur ? "Département d'Anglais uniquement" : "Personnel académique algérien"}
              </p>
            </div>
          </div>

          {isFormateur && (
            <div className="mt-4 mb-2 text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-2">
              ⚠ Les formations sont réservées aux enseignants du Département d'Anglais. Votre candidature sera refusée si vous n'appartenez pas à ce département.
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom" value={form.prenom} onChange={(v) => set("prenom", v)} placeholder="Mohamed" required />
              <Field label="Nom" value={form.nom} onChange={(v) => set("nom", v)} placeholder="Benali" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Âge" value={form.age} onChange={(v) => set("age", v)} type="number" placeholder="35" min="18" max="99" required />
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Type de compte</label>
                <select
                  value={form.typeCompte}
                  onChange={(e) => set("typeCompte", e.target.value)}
                  className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none"
                  required
                >
                  <option value="enseignant">Enseignant</option>
                  <option value="doctorant">Doctorant</option>
                </select>
              </div>
            </div>

            <Field
              label={form.typeCompte === "doctorant" ? "Numéro doctorant" : "Numéro enseignant"}
              value={form.numero}
              onChange={(v) => set("numero", v)}
              placeholder="N° matricule ou inscription"
              required
            />

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Université</label>
              <select
                value={form.universite}
                onChange={(e) => set("universite", e.target.value)}
                className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none"
                required
              >
                <option value="">Sélectionner une université...</option>
                {ALGERIAN_UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Faculté" value={form.faculte} onChange={(v) => set("faculte", v)} placeholder="Sciences Humaines" required />
              <Field
                label="Département"
                value={form.departement}
                onChange={(v) => set("departement", v)}
                placeholder={isFormateur ? "Anglais" : "Informatique"}
                required
              />
            </div>

            <Field label="Spécialité" value={form.specialite} onChange={(v) => set("specialite", v)} placeholder="Linguistique appliquée, NLP..." required />

            <Field label="Email universitaire" value={form.email} onChange={(v) => set("email", v)} type="email" placeholder="m.benali@univ-alger.dz" required />

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Mot de passe <span className="text-white/40 font-normal">(min. 8 caractères)</span></label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 pr-10 text-sm focus:border-primary/50 focus:outline-none"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Field label="Confirmer le mot de passe" value={form.confirmPassword} onChange={(v) => set("confirmPassword", v)} type="password" placeholder="••••••••" required />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Inscription en cours..." : "Créer mon compte"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Déjà inscrit ?{" "}
              <button type="button" onClick={() => navigate(`/auth/login?role=${role}`)} className="text-primary hover:underline">
                Se connecter
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required, min, max,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; min?: string; max?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30"
      />
    </div>
  );
}
