export const DEFAULT_PLANS = [
  {
    slug: "ugc",
    name: "UGC Videos",
    basePrice: 0,
    sampleVideoUrl: "",
    paymentEnabled: true,
    customizationOptions: [
      { key: "script-writing", label: "Script writing", amount: 1500 },
      { key: "subtitles", label: "Subtitles", amount: 500 },
      { key: "voiceover", label: "Voiceover", amount: 1200 },
      { key: "express-delivery", label: "Express delivery", amount: 2000 },
    ],
  },
  {
    slug: "pgc",
    name: "PGC Videos",
    basePrice: 0,
    sampleVideoUrl: "",
    paymentEnabled: false,
    customizationOptions: [
      { key: "script-writing", label: "Script writing", amount: 1800 },
      { key: "storyboarding", label: "Storyboarding", amount: 2500 },
      { key: "voiceover", label: "Voiceover", amount: 1200 },
      { key: "express-delivery", label: "Express delivery", amount: 2500 },
    ],
  },
  {
    slug: "bgc",
    name: "BGC Videos",
    basePrice: 0,
    sampleVideoUrl: "",
    paymentEnabled: false,
    customizationOptions: [
      { key: "script-writing", label: "Script writing", amount: 1800 },
      { key: "brand-alignment", label: "Brand alignment workshop", amount: 3000 },
      { key: "subtitles", label: "Subtitles", amount: 500 },
      { key: "express-delivery", label: "Express delivery", amount: 2500 },
    ],
  },
];
