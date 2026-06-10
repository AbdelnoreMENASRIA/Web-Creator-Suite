import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Video, BookOpen, GraduationCap, Users, Star, CheckCircle, Microscope } from "lucide-react";
import { useRef } from "react";
import heroAbstract from "@/assets/images/hero-abstract.png";
import studioWork from "@/assets/images/studio-work.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden" ref={containerRef}>

      {/* 1. HERO */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <img
            src={heroAbstract}
            alt="Abstract background"
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl">

            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <GraduationCap className="w-4 h-4" />
              <span>Plateforme leader en Algérie — Enseignement supérieur</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[110px] leading-[0.85] font-serif font-bold text-white tracking-tighter mb-8">
              TEACH IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ENGLISH.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12">
              La plateforme dédiée aux <strong className="text-white">enseignants</strong>, <strong className="text-white">doctorants</strong> et <strong className="text-white">personnels universitaires</strong> algériens pour maîtriser l'anglais académique et professionnel via des vidéoconférences en direct avec des experts certifiés.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
              <button data-testid="button-start-free" className="h-14 px-8 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-colors flex items-center gap-2 group">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button data-testid="button-discover" className="h-14 px-8 bg-transparent text-white border border-white/20 rounded-full font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                Découvrir le programme
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. POUR QUI */}
      <section className="py-32 relative" id="pour-qui">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
                Exclusivement pour le supérieur
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-6">
                Conçu pour <br /> l'université algérienne.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">
                TeachInEnglish ne s'adresse pas au grand public. Notre programme est entièrement calibré pour les besoins réels du monde académique algérien : cours magistraux en anglais, publications scientifiques, conférences internationales et communication institutionnelle.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-12">
                Chaque session vidéo est menée par un formateur expert en anglais académique, adapté à votre discipline et à votre niveau.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-white mb-2" data-testid="stat-participants">3 200+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">Participants formés</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2" data-testid="stat-universities">47</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">Universités partenaires</div>
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
              <img
                src={studioWork}
                alt="Session de formation en vidéoconférence"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PROGRAMME */}
      <section className="py-32 bg-card relative border-y border-white/5" id="programme">
        <div className="container mx-auto px-6 mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-center mb-6">Notre Programme.</h2>
          <p className="text-center text-muted-foreground text-xl max-w-2xl mx-auto">
            Des parcours spécialisés pour chaque profil du monde universitaire, dispensés en vidéoconférence individuelle.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Anglais pour Enseignants",
                desc: "Maîtrisez la conduite de cours magistraux, les corrections orales et les échanges pédagogiques en anglais."
              },
              {
                icon: Microscope,
                title: "Anglais pour Doctorants",
                desc: "Rédigez votre thèse, préparez votre soutenance et présentez vos travaux lors de conférences internationales."
              },
              {
                icon: GraduationCap,
                title: "Communication Universitaire",
                desc: "Correspondances institutionnelles, réunions de département et partenariats internationaux en anglais professionnel."
              },
              {
                icon: Video,
                title: "Sessions en Vidéoconférence",
                desc: "100% en direct, sans enregistrement. Un formateur certifié dédié à votre progression, disponible 7j/7."
              },
              {
                icon: Users,
                title: "Groupes ou Individuel",
                desc: "Choisissez une session individuelle pour une progression rapide ou intégrez un groupe de collègues de votre département."
              },
              {
                icon: CheckCircle,
                title: "Attestation Officielle",
                desc: "Recevez une attestation de formation reconnue, valorisable dans votre dossier professionnel et académique."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-background border border-white/5 hover:border-primary/50 transition-colors overflow-hidden"
                data-testid={`card-programme-${i}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <item.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEMOIGNAGES */}
      <section className="py-32" id="temoignages">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">Ils témoignent.</h2>
              <p className="text-xl text-muted-foreground max-w-md">Des enseignants et doctorants algériens qui ont transformé leur carrière.</p>
            </div>
            <button data-testid="button-view-stories" className="flex items-center gap-2 text-white hover:text-primary transition-colors uppercase tracking-widest text-sm font-bold">
              Voir tous les témoignages <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Dr. Amira Benali",
                role: "Maître de conférences, Université d'Oran",
                quote: "Grâce à TeachInEnglish, j'ai pu dispenser mes cours de chimie en anglais dès le premier semestre. La méthode par vidéoconférence m'a permis d'avancer à mon rythme.",
                color: "from-purple-900"
              },
              {
                name: "Yacine Meziani",
                role: "Doctorant en informatique, USTHB Alger",
                quote: "J'ai présenté ma communication à une conférence internationale à Barcelone. Sans TeachInEnglish, je n'aurais jamais osé. Le formateur a simulé des Q&A réels avec moi.",
                color: "from-blue-900"
              },
              {
                name: "Prof. Fatima Zahra Aïssa",
                role: "Professeure, Université de Constantine",
                quote: "La plateforme comprend les spécificités du monde académique algérien. Ce n'est pas un simple cours d'anglais général, c'est une formation taillée pour notre réalité.",
                color: "from-emerald-900"
              },
              {
                name: "Khaled Oussedik",
                role: "Enseignant-chercheur, Université de Tlemcen",
                quote: "J'ai soumis deux articles en anglais à des revues indexées dans les 6 mois suivant ma formation. Le module sur la rédaction scientifique est exceptionnel.",
                color: "from-rose-900"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group"
                data-testid={`card-temoignage-${i}`}
              >
                <div className="relative w-full rounded-2xl overflow-hidden bg-card p-8 border border-white/5 hover:border-primary/30 transition-colors">
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} to-black opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-xl text-white/90 leading-relaxed mb-8 font-medium">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. UNIVERSITES PARTENAIRES */}
      <section className="py-24 bg-card border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 mb-12 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Universités partenaires en Algérie</p>
        </div>

        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex gap-24 whitespace-nowrap px-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex gap-24 items-center">
                <div className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">USTHB ALGER</div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">UNIV. ORAN</div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">UNIV. CONSTANTINE</div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">UNIV. TLEMCEN</div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">UNIV. ANNABA</div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-white/30 hover:text-white transition-colors">UNIV. SÉTIF</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
