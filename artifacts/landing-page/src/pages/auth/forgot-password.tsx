import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      if (data.resetToken) {
        setResetToken(data.resetToken);
      } else {
        setResetToken("verified");
      }
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
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </button>

        <div className="rounded-3xl border border-white/10 bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Récupérer le mot de passe</h1>
              <p className="text-muted-foreground text-sm">Entrez votre email universitaire</p>
            </div>
          </div>

          {!resetToken ? (
            <>
              {error && (
                <div className="mb-5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email universitaire</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.benali@univ-alger.dz"
                    required
                    className="w-full h-11 rounded-xl bg-background border border-white/10 text-white px-3 text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Envoi..." : "Générer le token de réinitialisation"}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">Token généré avec succès</span>
              </div>
              {resetToken !== "verified" && (
                <div className="bg-background border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-2">Votre token de réinitialisation :</p>
                  <p className="font-mono text-xs text-primary break-all">{resetToken}</p>
                </div>
              )}
              <button
                onClick={() => navigate(`/auth/reset-password?token=${resetToken}`)}
                className="w-full h-12 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                Réinitialiser le mot de passe →
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
