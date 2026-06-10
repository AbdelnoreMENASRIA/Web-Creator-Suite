import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Layers, Globe, MonitorSmartphone, Code, Play } from "lucide-react";
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
              <Zap className="w-4 h-4" />
              <span>Digital Excellence</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-[140px] leading-[0.85] font-serif font-bold text-white tracking-tighter mb-8">
              WE BUILD <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">FUTURES.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
              We are a creative digital agency that refuses to blend in. We craft electric, unforgettable experiences for brands that want to dominate their category.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
              <button className="h-14 px-8 bg-white text-black rounded-full font-medium text-lg hover:bg-white/90 transition-colors flex items-center gap-2 group">
                See Our Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="h-14 px-8 bg-transparent text-white border border-white/20 rounded-full font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" />
                Showreel
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT / VIBE SECTION */}
      <section className="py-32 relative" id="studio">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-6">
                Not your average <br /> corporate machine.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">
                We operate at the intersection of rigorous strategy and unhinged creativity. Born in the dark hours where the best ideas happen, our studio is a haven for misfits, obsessives, and perfectionists.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-12">
                We don't do templates. We don't do safe. We do work that makes people stop, stare, and feel something.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-white mb-2">42+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">Industry Awards</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">$2B</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest">Client Revenue Gen</div>
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
                alt="Our Studio Workspace" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES MARQUEE & GRID */}
      <section className="py-32 bg-card relative border-y border-white/5" id="services">
        <div className="container mx-auto px-6 mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-center mb-6">Our Capabilities.</h2>
          <p className="text-center text-muted-foreground text-xl max-w-2xl mx-auto">
            End-to-end digital firepower to elevate your brand from noise to signal.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Brand Identity", desc: "Positioning, visual systems, and brand narratives that stick." },
              { icon: Globe, title: "Digital Platforms", desc: "Award-winning websites and web apps built for conversion." },
              { icon: MonitorSmartphone, title: "Product Design", desc: "Intuitive UI/UX design for complex SaaS and mobile apps." },
              { icon: Code, title: "Creative Dev", desc: "WebGL, Three.js, and cutting-edge frontend engineering." },
              { icon: Zap, title: "Motion & 3D", desc: "High-end motion graphics and cinematic 3D renders." },
              { icon: ArrowRight, title: "Growth Strategy", desc: "Data-driven campaigns that scale your bottom line." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-background border border-white/5 hover:border-primary/50 transition-colors overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <service.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SELECTED WORK */}
      <section className="py-32" id="work">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">Selected Work.</h2>
              <p className="text-xl text-muted-foreground max-w-md">Proof, not promises. A curation of our finest digital artifacts.</p>
            </div>
            <button className="flex items-center gap-2 text-white hover:text-primary transition-colors uppercase tracking-widest text-sm font-bold">
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {[
              { title: "Neon Pulse", category: "Web3 Platform", height: "aspect-[4/3]", mt: "md:mt-0" },
              { title: "Aura Skincare", category: "E-Commerce", height: "aspect-square", mt: "md:mt-24" },
              { title: "Apex Capital", category: "Fintech App", height: "aspect-square", mt: "md:mt-0" },
              { title: "Void Studios", category: "Brand Identity", height: "aspect-[4/3]", mt: "md:mt-24" },
            ].map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`group cursor-pointer ${project.mt}`}
              >
                <div className={`relative ${project.height} w-full rounded-2xl overflow-hidden mb-6 bg-card`}>
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                  {/* Placeholder gradient since we don't have enough generated images for all projects, 
                      this mimics the dark/neon vibe perfectly */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    i === 0 ? 'from-purple-900 to-black' : 
                    i === 1 ? 'from-blue-900 to-black' : 
                    i === 2 ? 'from-emerald-900 to-black' : 
                    'from-rose-900 to-black'
                  } group-hover:scale-105 transition-transform duration-700 ease-out`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground">{project.category}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLIENTS / TRUST */}
      <section className="py-24 bg-card border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 mb-12 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Trusted by industry leaders</p>
        </div>
        
        {/* Simple Marquee implementation */}
        <div className="flex w-full overflow-hidden">
          <motion.div 
            className="flex gap-24 whitespace-nowrap px-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex gap-24 items-center">
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">ACME CORP</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">NEXUS GLOBAL</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">ZENITH</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">PULSE STUDIOS</div>
                <div className="text-2xl md:text-4xl font-serif font-bold text-white/30 hover:text-white transition-colors">QUANTUM</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
