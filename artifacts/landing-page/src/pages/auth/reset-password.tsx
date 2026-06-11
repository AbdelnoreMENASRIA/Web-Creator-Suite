import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useLocation, useSearch } from "wouter";

export default function ResetPassword() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const token = params.get("token") ?? "";
  const [, navigate] = useLocation();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate("/auth/login")}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Connexion
        </button>

        <div className="rounded-3xl border border-white/10 bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">Nouveau mot de passe</h1>
          </div>

          {done ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">Mot de passe réinitialisé avec succès !</span>
              </div>
              <button
                onClick={() => navigate("/auth/login")}
                className="w-full h-12 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 pr-10 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : "Enregistrer le nouveau mot de passe"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
