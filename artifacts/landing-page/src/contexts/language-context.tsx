import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "fr" | "en" | "ar";

export const translations = {
  fr: {
    nav: {
      programme: "Programme",
      pourQui: "Pour qui",
      temoignages: "FAQ",
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
      ctaPrimary: "Commencer maintenant",
      ctaSecondary: "Découvrir le programme",
    },
    pourQui: {
      tag: "Exclusivement pour le supérieur",
      title1: "Conçu pour",
      title2: "l'université algérienne.",
      p1: "TeachInEnglish ne s'adresse pas au grand public. Notre programme est entièrement calibré pour les besoins réels du monde académique algérien : cours magistraux en anglais, publications scientifiques, conférences internationales et communication institutionnelle.",
      p2: "Chaque session vidéo est menée par un formateur expert en anglais académique, adapté à votre discipline et à votre niveau.",
      stat1Val: "3 200+",
      stat1Label: "Inscrits attendus",
      stat2Val: "47",
      stat2Label: "Wilayas couvertes",
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
    faq: {
      tag: "Questions fréquentes",
      title: "Vous avez des questions ?",
      subtitle: "Tout ce qu'il faut savoir avant de rejoindre TeachInEnglish.",
      items: [
        { q: "À qui s'adresse TeachInEnglish ?", a: "Exclusivement aux enseignants, doctorants et personnels universitaires algériens du secteur de l'enseignement supérieur. La plateforme n'est pas ouverte au grand public." },
        { q: "Comment se déroulent les sessions ?", a: "Chaque session est une vidéoconférence individuelle en direct avec un formateur certifié. Aucun enregistrement, aucune rediffusion. Vous choisissez le jour et l'heure qui vous conviennent." },
        { q: "Quel est le niveau d'anglais requis pour commencer ?", a: "Aucun niveau minimum requis. Un test de positionnement est réalisé lors de votre première session pour adapter le programme à votre niveau exact." },
        { q: "Combien de temps faut-il pour progresser ?", a: "La plupart des participants constatent une progression significative après 8 à 12 sessions. La régularité (1 à 2 sessions par semaine) est le facteur clé." },
        { q: "Puis-je obtenir une attestation de formation ?", a: "Oui. À l'issue du parcours, vous recevez une attestation officielle de TeachInEnglish valorisable dans votre dossier professionnel et académique." },
        { q: "Comment réserver ma première session ?", a: "Cliquez sur « Commencer maintenant », remplissez le formulaire en 2 minutes, et un coordinateur vous contacte sous 24h pour planifier votre première session gratuite." },
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
      temoignages: "FAQ",
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
      ctaPrimary: "Get started now",
      ctaSecondary: "Explore the programme",
    },
    pourQui: {
      tag: "Exclusively for higher education",
      title1: "Built for",
      title2: "Algerian universities.",
      p1: "TeachInEnglish is not for the general public. Our programme is entirely calibrated to the real needs of the Algerian academic world: English-medium lectures, scientific publications, international conferences and institutional communication.",
      p2: "Every video session is led by an expert trainer in academic English, adapted to your discipline and your level.",
      stat1Val: "3,200+",
      stat1Label: "Expected enrolments",
      stat2Val: "47",
      stat2Label: "Wilayas covered",
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
    faq: {
      tag: "FAQ",
      title: "Got questions?",
      subtitle: "Everything you need to know before joining TeachInEnglish.",
      items: [
        { q: "Who is TeachInEnglish for?", a: "Exclusively for Algerian teachers, doctoral students, and university staff in higher education. The platform is not open to the general public." },
        { q: "How do the sessions work?", a: "Each session is a live one-on-one video conference with a certified trainer. No recordings, no replays. You choose the day and time that suits you." },
        { q: "What level of English do I need to start?", a: "No minimum level required. A placement assessment is conducted in your first session to tailor the programme exactly to your level." },
        { q: "How long does it take to progress?", a: "Most participants see significant progress after 8 to 12 sessions. Consistency — 1 to 2 sessions per week — is the key factor." },
        { q: "Can I get a training certificate?", a: "Yes. At the end of your programme, you receive an official TeachInEnglish certificate that can be included in your professional and academic portfolio." },
        { q: "How do I book my first session?", a: "Click \"Get started now\", fill in the 2-minute form, and a coordinator will contact you within 24 hours to schedule your free first session." },
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
      temoignages: "FAQ",
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
      ctaPrimary: "ابدأ الآن",
      ctaSecondary: "اكتشف البرنامج",
    },
    pourQui: {
      tag: "حصرياً للتعليم العالي",
      title1: "مصمَّم من أجل",
      title2: "الجامعة الجزائرية.",
      p1: "TeachInEnglish ليست للعموم. برنامجنا مُعايَر بالكامل وفق الاحتياجات الحقيقية للعالم الأكاديمي الجزائري: المحاضرات باللغة الإنجليزية، النشر العلمي، المؤتمرات الدولية، والتواصل المؤسسي.",
      p2: "كل جلسة فيديو يُديرها مدرب متخصص في الإنجليزية الأكاديمية، مكيَّفة مع تخصصك ومستواك.",
      stat1Val: "+3200",
      stat1Label: "تسجيل مستهدف",
      stat2Val: "47",
      stat2Label: "ولاية مشمولة",
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
    faq: {
      tag: "أسئلة شائعة",
      title: "لديك أسئلة؟",
      subtitle: "كل ما تحتاج معرفته قبل الانضمام إلى TeachInEnglish.",
      items: [
        { q: "لمن تُوجَّه TeachInEnglish؟", a: "حصرياً للأساتذة وطلاب الدكتوراه والعمال الجامعيين الجزائريين في قطاع التعليم العالي. المنصة ليست مفتوحة للعموم." },
        { q: "كيف تسير الجلسات؟", a: "كل جلسة هي مؤتمر فيديو فردي مباشر مع مدرب معتمد. لا تسجيل، لا إعادة بث. أنت تختار اليوم والوقت المناسبين لك." },
        { q: "ما المستوى المطلوب للبدء؟", a: "لا يُشترط مستوى أدنى. يُجرى تقييم تحديد المستوى خلال جلستك الأولى لتكييف البرنامج وفق مستواك الفعلي." },
        { q: "كم من الوقت يستغرق التقدم؟", a: "يلاحظ معظم المشاركين تقدماً ملموساً بعد 8 إلى 12 جلسة. الانتظام بواقع جلسة إلى جلستين أسبوعياً هو العامل الحاسم." },
        { q: "هل يمكنني الحصول على شهادة تكوين؟", a: "نعم. في نهاية المسار، تحصل على شهادة رسمية من TeachInEnglish يمكن إدراجها في ملفك المهني والأكاديمي." },
        { q: "كيف أحجز جلستي الأولى؟", a: "انقر على «ابدأ الآن»، أكمل النموذج في دقيقتين، وسيتصل بك منسق خلال 24 ساعة لتحديد موعد جلستك الأولى المجانية." },
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
