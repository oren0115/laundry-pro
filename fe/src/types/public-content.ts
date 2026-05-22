export type PublicSite = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsappMessage: string;
};

export type PublicHero = {
  headline: string;
  headlineHighlight: string;
  subheadline: string;
  badges: string[];
  socialProof: string;
  images: {
    main: string;
    courier: string;
    customer: string;
    facility: string;
    background: string;
  };
};

export type PublicPromoStrip = {
  enabled: boolean;
  title: string;
  description: string;
  code: string;
  linkLabel: string;
  linkHash: string;
};

export type PublicStat = {
  key: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
};

export type PublicServiceItem = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  estimate: string;
  icon: string;
};

export type PublicPricingTier = {
  id: string;
  name: string;
  description: string;
  priceKg: number;
  priceItem: number;
  features: string[];
  highlight: boolean;
};

export type PublicPromo = {
  title: string;
  code: string;
  until: string;
};

export type PublicTestimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
};

export type PublicFaq = {
  q: string;
  a: string;
};

export type PublicBranch = {
  name: string;
  address: string;
  phone: string;
};

export type PublicCta = {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage: string;
};

export type PublicContentData = {
  site: PublicSite;
  hero: PublicHero;
  promoStrip: PublicPromoStrip;
  stats: PublicStat[];
  services: PublicServiceItem[];
  pricingTiers: PublicPricingTier[];
  pricingRows: { service: string; price: string; estimate: string; minimum: string }[];
  memberPackages: { name: string; price: string; perks: string[]; highlight: boolean }[];
  monthlyPackages: { name: string; price: string; detail: string }[];
  promos: PublicPromo[];
  testimonials: PublicTestimonial[];
  faqs: PublicFaq[];
  branches: PublicBranch[];
  cta: PublicCta;
};
