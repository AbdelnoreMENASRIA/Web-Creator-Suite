import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Video, Globe, Users, Star, CheckCircle, Play } from "lucide-react";
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
    transition: {
      staggerChildren: 0.1,
    }
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

      {/* 1. HERO SECTION */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          <img
            src={heroAbstract}
            alt="Abstract dark fluid neon shapes"
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <Video className="w-4 h-4" />
              <span>100% Live Video Conferences</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-[140px] leading-[0.85] font-serif font-bold text-white tracking-tighter mb-8">
              SPEAK <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ENGLISH.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
              Master English through live one-on-one video sessions with certified native teachers. No recordings. No bots. Just real conversations that transform your fluency.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
              <button data-testid="button-start-free" className="h-14 px-8 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-colors flex items-center gap-2 group">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button data-testid="button-watch-demo" className="h-14 px-8 bg-transparent text-white border border-white/20 rounded-full font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. WHY US SECTION */}
      <section className="py-32 relative" id="about">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-6">
                Learn faster. <br /> The live way.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">
                Traditional apps give you exercises. We give you real conversations. Every session is a private video call with a certified teacher, tailored to your level and goals — from beginner to business fluent.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-12">
                No scripts. No repetitive drills. Just immersive, natural English the way it's actually spoken.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-white mb-2" data-testid="stat-students">12K+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">Active Students</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2" data-testid="stat-sessions">98%</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">Satisfaction Rate</div>
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
                alt="Live video conference English class"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-32 bg-card relative border-y border-white/5" id="how-it-works">
        <div className="container mx-auto px-6 mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-center mb-6">How It Works.</h2>
          <p className="text-center text-muted-foreground text-xl max-w-2xl mx-auto">
            Three simple steps to your first live English session.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle, title: "1. Choose Your Level", desc: "Take a 5-minute placement test. We match you with the right teacher and curriculum instantly." },
              { icon: Video, title: "2. Book a Session", desc: "Pick a time that suits you. Sessions are 30 or 60 minutes, available 7 days a week." },
              { icon: Globe, title: "3. Join Your Video Call", desc: "Connect live with your certified native teacher. No downloads required — just click and speak." },
              { icon: Users, title: "One-on-One Focus", desc: "Every session is private. Your teacher's full attention is on you, your progress, your goals." },
              { icon: Star, title: "Certified Native Teachers", desc: "All our teachers are native English speakers with CELTA or TEFL certification." },
              { icon: ArrowRight, title: "Track Your Progress", desc: "After each session, receive a detailed feedback report and homework tailored to your weak points." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-background border border-white/5 hover:border-primary/50 transition-colors overflow-hidden"
                data-testid={`card-step-${i}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <step.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="py-32" id="testimonials">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">Real Results.</h2>
              <p className="text-xl text-muted-foreground max-w-md">From our students, not us. Their words, their transformation.</p>
            </div>
            <button data-testid="button-view-stories" className="flex items-center gap-2 text-white hover:text-primary transition-colors uppercase tracking-widest text-sm font-bold">
              View All Stories <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {[
              { name: "Yasmine K.", role: "Marketing Manager, Paris", quote: "After 3 months of weekly sessions, I got promoted to the international team. My confidence in English meetings completely changed.", color: "from-purple-900 to-black" },
              { name: "Carlos M.", role: "Software Engineer, Madrid", quote: "I tried apps for years with zero results. One month of live sessions and I was passing technical interviews in English.", color: "from-blue-900 to-black" },
              { name: "Aisha T.", role: "Medical Student, Tunis", quote: "The teacher adapted every session to medical vocabulary. No other platform offers that level of personalization.", color: "from-emerald-900 to-black" },
              { name: "Luca R.", role: "Entrepreneur, Milan", quote: "I went from stumbling through basic sentences to giving a pitch in English to investors. Worth every minute.", color: "from-rose-900 to-black" },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group cursor-pointer"
                data-testid={`card-testimonial-${i}`}
              >
                <div className={`relative w-full rounded-2xl overflow-hidden mb-6 bg-card p-8 border border-white/5 hover:border-primary/30 transition-colors`}>
                  <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{backgroundImage: `linear-gradient(to bottom right, var(--from-color, #4c1d95), #000)`}}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-20`}></div>
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

      {/* 5. TRUST / PARTNERS */}
      <section className="py-24 bg-card border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 mb-12 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Trusted by students from</p>
        </div>

        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex gap-24 whitespace-nowrap px-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex gap-24 items-center">
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">FRANCE</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">MAROC</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">ALGERIE</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">TUNISIE</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">ESPAGNE</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">ITALIE</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
