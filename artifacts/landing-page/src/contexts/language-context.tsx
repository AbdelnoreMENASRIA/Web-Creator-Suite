import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "fr" | "en" | "ar";

export const translations = {
  fr: {
    nav: {
      programme: "Programme",
      pourQui: "Pour qui",
      temoignages: "Témoignages",
      cta: "Réserver une session",
    },
    hero: {
      badge: "Plateforme leader en Algérie — Enseignement supérieur",
      title1: "TEACH IN",
      title2: "ENGLISH.",
      subtitle: "La plateforme dédiée aux",
      subtitleBold1: "enseignants",
      subtitleMid1: ", ",
      subtitleBold2: "doctorants",
      subtitleMid2: " et ",
      subtitleBold3: "personnels universitaires",
      subtitleEnd: " algériens pour maîtriser l'anglais académique et professionnel via des vidéoconférences en direct avec des experts certifiés.",
      ctaPrimary: "Commencer gratuitement",
      ctaSecondary: "Découvrir le programme",
    },
    pourQui: {
      tag: "Exclusivement pour le supérieur",
      title1: "Conçu pour",
      title2: "l'université algérienne.",
      p1: "TeachInEnglish ne s'adresse pas au grand public. Notre programme est entièrement calibré pour les besoins réels du monde académique algérien : cours magistraux en anglais, publications scientifiques, conférences internationales et communication institutionnelle.",
      p2: "Chaque session vidéo est menée par un formateur expert en anglais académique, adapté à votre discipline et à votre niveau.",
      stat1Val: "3 200+",
      stat1Label: "Participants formés",
      stat2Val: "47",
      stat2Label: "Universités partenaires",
      imgAlt: "Session de formation en vidéoconférence",
    },
    programme: {
      title: "Notre Programme.",
      subtitle: "Des parcours spécialisés pour chaque profil du monde universitaire, dispensés en vidéoconférence individuelle.",
      items: [
        { title: "Anglais pour Enseignants", desc: "Maîtrisez la conduite de cours magistraux, les corrections orales et les échanges pédagogiques en anglais." },
        { title: "Anglais pour Doctorants", desc: "Rédigez votre thèse, préparez votre soutenance et présentez vos travaux lors de conférences internationales." },
        { title: "Communication Universitaire", desc: "Correspondances institutionnelles, réunions de département et partenariats internationaux en anglais professionnel." },
        { title: "Sessions en Vidéoconférence", desc: "100% en direct, sans enregistrement. Un formateur certifié dédié à votre progression, disponible 7j/7." },
        { title: "Groupes ou Individuel", desc: "Choisissez une session individuelle pour une progression rapide ou intégrez un groupe de collègues de votre département." },
        { title: "Attestation Officielle", desc: "Recevez une attestation de formation reconnue, valorisable dans votre dossier professionnel et académique." },
      ],
    },
    temoignages: {
      title: "Ils témoignent.",
      subtitle: "Des enseignants et doctorants algériens qui ont transformé leur carrière.",
      cta: "Voir tous les témoignages",
      items: [
        { name: "Dr. Amira Benali", role: "Maître de conférences, Université d'Oran", quote: "Grâce à TeachInEnglish, j'ai pu dispenser mes cours de chimie en anglais dès le premier semestre. La méthode par vidéoconférence m'a permis d'avancer à mon rythme." },
        { name: "Yacine Meziani", role: "Doctorant en informatique, USTHB Alger", quote: "J'ai présenté ma communication à une conférence internationale à Barcelone. Sans TeachInEnglish, je n'aurais jamais osé. Le formateur a simulé des Q&A réels avec moi." },
        { name: "Prof. Fatima Zahra Aïssa", role: "Professeure, Université de Constantine", quote: "La plateforme comprend les spécificités du monde académique algérien. Ce n'est pas un simple cours d'anglais général, c'est une formation taillée pour notre réalité." },
        { name: "Khaled Oussedik", role: "Enseignant-chercheur, Université de Tlemcen", quote: "J'ai soumis deux articles en anglais à des revues indexées dans les 6 mois suivant ma formation. Le module sur la rédaction scientifique est exceptionnel." },
      ],
    },
    partners: {
      label: "Universités partenaires en Algérie",
    },
    footer: {
      title1: "Prêt à enseigner",
      title2: "en anglais ?",
      subtitle: "Rejoignez la plateforme leader en Algérie pour les enseignants et chercheurs du supérieur. Votre première session est offerte.",
      email: "contact@teachinenglish.dz",
      navTitle: "Navigation",
      navLinks: ["Programme", "Pour qui", "Témoignages", "Tarifs"],
      socialTitle: "Nous suivre",
      copyright: "TeachInEnglish. Tous droits réservés. Algérie.",
      privacy: "Confidentialité",
      terms: "Conditions",
    },
  },
  en: {
    nav: {
      programme: "Programme",
      pourQui: "Who is it for",
      temoignages: "Testimonials",
      cta: "Book a session",
    },
    hero: {
      badge: "Algeria's leading platform — Higher Education",
      title1: "TEACH IN",
      title2: "ENGLISH.",
      subtitle: "The platform dedicated to Algerian",
      subtitleBold1: "teachers",
      subtitleMid1: ", ",
      subtitleBold2: "doctoral students",
      subtitleMid2: " and ",
      subtitleBold3: "university staff",
      subtitleEnd: " to master academic and professional English through live video conferences with certified experts.",
      ctaPrimary: "Start for free",
      ctaSecondary: "Explore the programme",
    },
    pourQui: {
      tag: "Exclusively for higher education",
      title1: "Built for",
      title2: "Algerian universities.",
      p1: "TeachInEnglish is not for the general public. Our programme is entirely calibrated to the real needs of the Algerian academic world: English-medium lectures, scientific publications, international conferences and institutional communication.",
      p2: "Every video session is led by an expert trainer in academic English, adapted to your discipline and your level.",
      stat1Val: "3,200+",
      stat1Label: "Trained participants",
      stat2Val: "47",
      stat2Label: "Partner universities",
      imgAlt: "Live video conference training session",
    },
    programme: {
      title: "Our Programme.",
      subtitle: "Specialised tracks for every university profile, delivered via individual video conference.",
      items: [
        { title: "English for Teachers", desc: "Master lecturing, oral feedback, and pedagogical exchanges in English." },
        { title: "English for Doctoral Students", desc: "Write your thesis, prepare your defence, and present your work at international conferences." },
        { title: "University Communication", desc: "Institutional correspondence, department meetings and international partnerships in professional English." },
        { title: "Video Conference Sessions", desc: "100% live, no recordings. A certified trainer dedicated to your progress, available 7 days a week." },
        { title: "Group or Individual", desc: "Choose an individual session for rapid progress or join a group with colleagues from your department." },
        { title: "Official Certificate", desc: "Receive a recognised training certificate to enhance your professional and academic portfolio." },
      ],
    },
    temoignages: {
      title: "They speak up.",
      subtitle: "Algerian teachers and doctoral students who transformed their careers.",
      cta: "View all testimonials",
      items: [
        { name: "Dr. Amira Benali", role: "Associate Professor, University of Oran", quote: "Thanks to TeachInEnglish, I was able to deliver my chemistry lectures in English from the very first semester. The video conference method let me progress at my own pace." },
        { name: "Yacine Meziani", role: "PhD student in Computer Science, USTHB Algiers", quote: "I presented my paper at an international conference in Barcelona. Without TeachInEnglish I would never have dared. The trainer ran realistic Q&A simulations with me." },
        { name: "Prof. Fatima Zahra Aïssa", role: "Professor, University of Constantine", quote: "The platform understands the specificities of the Algerian academic world. This is not a generic English course — it's training tailored to our reality." },
        { name: "Khaled Oussedik", role: "Researcher-teacher, University of Tlemcen", quote: "I submitted two English articles to indexed journals within 6 months of my training. The scientific writing module is outstanding." },
      ],
    },
    partners: {
      label: "Partner universities in Algeria",
    },
    footer: {
      title1: "Ready to teach",
      title2: "in English?",
      subtitle: "Join Algeria's leading platform for higher education teachers and researchers. Your first session is free.",
      email: "contact@teachinenglish.dz",
      navTitle: "Navigation",
      navLinks: ["Programme", "Who is it for", "Testimonials", "Pricing"],
      socialTitle: "Follow us",
      copyright: "TeachInEnglish. All rights reserved. Algeria.",
      privacy: "Privacy",
      terms: "Terms",
    },
  },
  ar: {
    nav: {
      programme: "البرنامج",
      pourQui: "لمن هو",
      temoignages: "شهادات",
      cta: "احجز جلسة",
    },
    hero: {
      badge: "المنصة الرائدة في الجزائر — التعليم العالي",
      title1: "درِّس",
      title2: "بالإنجليزية.",
      subtitle: "المنصة المخصصة لـ",
      subtitleBold1: "الأساتذة",
      subtitleMid1: " و",
      subtitleBold2: "طلاب الدكتوراه",
      subtitleMid2: " و",
      subtitleBold3: "العمال الجامعيين",
      subtitleEnd: " الجزائريين لإتقان اللغة الإنجليزية الأكاديمية والمهنية عبر مؤتمرات الفيديو المباشرة مع خبراء معتمدين.",
      ctaPrimary: "ابدأ مجاناً",
      ctaSecondary: "اكتشف البرنامج",
    },
    pourQui: {
      tag: "حصرياً للتعليم العالي",
      title1: "مصمَّم من أجل",
      title2: "الجامعة الجزائرية.",
      p1: "TeachInEnglish ليست للعموم. برنامجنا مُعايَر بالكامل وفق الاحتياجات الحقيقية للعالم الأكاديمي الجزائري: المحاضرات باللغة الإنجليزية، النشر العلمي، المؤتمرات الدولية، والتواصل المؤسسي.",
      p2: "كل جلسة فيديو يُديرها مدرب متخصص في الإنجليزية الأكاديمية، مكيَّفة مع تخصصك ومستواك.",
      stat1Val: "+3200",
      stat1Label: "مشارك مُدرَّب",
      stat2Val: "47",
      stat2Label: "جامعة شريكة",
      imgAlt: "جلسة تدريبية عبر مؤتمر الفيديو",
    },
    programme: {
      title: "برنامجنا.",
      subtitle: "مسارات متخصصة لكل فئة في الوسط الجامعي، تُقدَّم عبر مؤتمر فيديو فردي.",
      items: [
        { title: "الإنجليزية للأساتذة", desc: "أتقن إلقاء المحاضرات والتصحيح الشفهي والتبادلات التربوية باللغة الإنجليزية." },
        { title: "الإنجليزية لطلاب الدكتوراه", desc: "اكتب رسالتك، استعد لمناقشتها، وقدِّم أبحاثك في المؤتمرات الدولية." },
        { title: "التواصل الجامعي", desc: "المراسلات المؤسسية، اجتماعات الأقسام والشراكات الدولية بإنجليزية مهنية." },
        { title: "جلسات عبر الفيديو", desc: "100% مباشر بدون تسجيل. مدرب معتمد مخصص لتقدمك، متاح 7 أيام في الأسبوع." },
        { title: "مجموعة أو فردي", desc: "اختر جلسة فردية للتقدم السريع أو انضم إلى مجموعة من زملائك في القسم." },
        { title: "شهادة رسمية", desc: "احصل على شهادة تكوين معترف بها لتعزيز ملفك المهني والأكاديمي." },
      ],
    },
    temoignages: {
      title: "شهاداتهم.",
      subtitle: "أساتذة وطلاب دكتوراه جزائريون غيّروا مسيرتهم المهنية.",
      cta: "عرض جميع الشهادات",
      items: [
        { name: "د. أميرة بن علي", role: "أستاذة محاضرة، جامعة وهران", quote: "بفضل TeachInEnglish تمكنت من تدريس مادة الكيمياء بالإنجليزية منذ الفصل الأول. أسلوب مؤتمر الفيديو أتاح لي التقدم وفق وتيرتي الخاصة." },
        { name: "ياسين مزياني", role: "طالب دكتوراه في الإعلام الآلي، جامعة هواري بومدين", quote: "قدمت ورقة بحثية في مؤتمر دولي ببرشلونة. بدون TeachInEnglish لم أكن لأجرؤ على ذلك. المدرب أجرى معي محاكاة لأسئلة حقيقية." },
        { name: "أ. فاطمة الزهراء عيسى", role: "أستاذة، جامعة قسنطينة", quote: "المنصة تفهم خصوصيات الوسط الأكاديمي الجزائري. ليست مجرد دروس إنجليزية عامة، بل تكوين مصمَّم لواقعنا." },
        { name: "خالد وسديق", role: "أستاذ باحث، جامعة تلمسان", quote: "أرسلت مقالين باللغة الإنجليزية إلى مجلات مُفهرسة في غضون 6 أشهر من تكويني. وحدة الكتابة العلمية استثنائية." },
      ],
    },
    partners: {
      label: "الجامعات الشريكة في الجزائر",
    },
    footer: {
      title1: "مستعد للتدريس",
      title2: "بالإنجليزية؟",
      subtitle: "انضم إلى المنصة الرائدة في الجزائر للأساتذة والباحثين في التعليم العالي. جلستك الأولى مجانية.",
      email: "contact@teachinenglish.dz",
      navTitle: "التنقل",
      navLinks: ["البرنامج", "لمن هو", "شهادات", "الأسعار"],
      socialTitle: "تابعنا",
      copyright: "TeachInEnglish. جميع الحقوق محفوظة. الجزائر.",
      privacy: "الخصوصية",
      terms: "الشروط",
    },
  },
};

export type Translations = typeof translations.fr;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr,
  isRtl: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("tie-lang", l);
  };

  useEffect(() => {
    const saved = localStorage.getItem("tie-lang") as Lang | null;
    if (saved && ["fr", "en", "ar"].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const isRtl = lang === "ar";

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang, isRtl]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
