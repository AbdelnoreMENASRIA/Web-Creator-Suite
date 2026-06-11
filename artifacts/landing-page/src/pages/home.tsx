import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Video, BookOpen, GraduationCap, Users, CheckCircle, Microscope, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import heroAbstract from "@/assets/images/hero-abstract.png";
import studioWork from "@/assets/images/studio-work.png";
import { useLanguage } from "@/contexts/language-context";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const PROGRAMME_ICONS = [BookOpen, Microscope, GraduationCap, Video, Users, CheckCircle];

function FaqItem({ question, answer, index, isRtl }: { question: string; answer: string; index: number; isRtl: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/8 bg-card overflow-hidden"
      data-testid={`faq-item-${index}`}
    >
      <button
        className={`w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/5 transition-colors ${isRtl ? "flex-row-reverse text-right" : ""}`}
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${index}`}
      >
        <span className="text-lg font-semibold text-white leading-snug">{question}</span>
        <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className={`px-6 pb-6 text-muted-foreground leading-relaxed ${isRtl ? "text-right" : ""}`}>{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { t, isRtl } = useLanguage();
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden" ref={containerRef}>

      {/* HERO */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <img src={heroAbstract} alt="Abstract background" className="w-full h-full object-cover opacity-60 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className={`max-w-5xl ${isRtl ? "text-right" : ""}`}>

            <motion.div variants={fadeInUp} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>{t.hero.badge}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[110px] leading-[0.85] font-serif font-bold text-white tracking-tighter mb-8">
              {t.hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t.hero.title2}</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12">
              {t.hero.subtitle}{" "}
              <strong className="text-white">{t.hero.subtitleBold1}</strong>
              {t.hero.subtitleMid1}
              <strong className="text-white">{t.hero.subtitleBold2}</strong>
              {t.hero.subtitleMid2}
              <strong className="text-white">{t.hero.subtitleBold3}</strong>
              {t.hero.subtitleEnd}
            </motion.p>

            <motion.div variants={fadeInUp} className={`flex flex-wrap items-center gap-6 ${isRtl ? "flex-row-reverse" : ""}`}>
              <button
                data-testid="button-start-free"
                onClick={() => navigate("/auth")}
                className="h-14 px-8 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-colors flex items-center gap-2 group"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRtl ? "rotate-180" : ""}`} />
              </button>
              <button data-testid="button-discover" className="h-14 px-8 bg-transparent text-white border border-white/20 rounded-full font-medium text-lg hover:bg-white/10 transition-colors">
                {t.hero.ctaSecondary}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="py-32 relative" id="pour-qui">
        <div className="container mx-auto px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isRtl ? "direction-rtl" : ""}`}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className={isRtl ? "text-right" : ""}>
              <motion.p variants={fadeInUp} className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
                {t.pourQui.tag}
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-6">
                {t.pourQui.title1} <br /> {t.pourQui.title2}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">{t.pourQui.p1}</motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-12">{t.pourQui.p2}</motion.p>

              <motion.div variants={fadeInUp} className={`grid grid-cols-2 gap-8 ${isRtl ? "text-right" : ""}`}>
                <div>
                  <div className="text-5xl font-bold text-white mb-2" data-testid="stat-participants">{t.pourQui.stat1Val}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">{t.pourQui.stat1Label}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2" data-testid="stat-universities">{t.pourQui.stat2Val}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">{t.pourQui.stat2Label}</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
              <img src={studioWork} alt={t.pourQui.imgAlt} className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="py-32 bg-card relative border-y border-white/5" id="programme">
        <div className="container mx-auto px-6 mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-center mb-6">{t.programme.title}</h2>
          <p className="text-center text-muted-foreground text-xl max-w-2xl mx-auto">{t.programme.subtitle}</p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.programme.items.map((item, i) => {
              const Icon = PROGRAMME_ICONS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`group relative p-8 rounded-3xl bg-background border border-white/5 hover:border-primary/50 transition-colors overflow-hidden ${isRtl ? "text-right" : ""}`}
                  data-testid={`card-programme-${i}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Icon className={`w-10 h-10 text-primary mb-6 ${isRtl ? "ml-auto" : ""}`} />
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32" id="temoignages">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className={`max-w-3xl mx-auto ${isRtl ? "text-right" : ""}`}
          >
            <motion.p variants={fadeInUp} className="text-sm font-medium text-primary uppercase tracking-widest mb-4 text-center">
              {t.faq.tag}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-bold mb-6 text-center">
              {t.faq.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-16 text-center">
              {t.faq.subtitle}
            </motion.p>

            <div className="flex flex-col gap-3">
              {t.faq.items.map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} index={i} isRtl={isRtl} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-24 bg-card border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 mb-12 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{t.partners.label}</p>
        </div>
        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex gap-24 whitespace-nowrap px-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex gap-24 items-center">
                {["USTHB ALGER", "UNIV. ORAN", "UNIV. CONSTANTINE", "UNIV. TLEMCEN", "UNIV. ANNABA", "UNIV. SÉTIF"].map((u) => (
                  <div key={u} className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">{u}</div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
