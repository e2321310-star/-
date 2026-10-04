import type { ConcernKey, ProductCategory, ProductRegion } from "./types";

// 悩みごとに色分けし、画面全体で一貫した配色にする（若年層向けに彩度高めのポップな配色）
export const CONCERN_BADGE_CLASS: Record<ConcernKey, string> = {
  pores: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  brightening: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  dryness: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  oiliness: "bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300",
  firmness: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  soothing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
};

export const CONCERN_DOT_CLASS: Record<ConcernKey, string> = {
  pores: "bg-orange-500",
  brightening: "bg-pink-500",
  dryness: "bg-sky-500",
  oiliness: "bg-lime-500",
  firmness: "bg-violet-500",
  soothing: "bg-emerald-500",
};

// 産地タグの配色（韓国＝シアン、欧米＝アンバーで、ぱっと見で海外ブランドが分かるように）
export const PRODUCT_REGION_BADGE_CLASS: Record<ProductRegion, string> = {
  jp: "bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-400",
  kr: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
  west: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

export const CATEGORY_ICON: Record<ProductCategory, string> = {
  cleansing: "🧴",
  faceWash: "🧼",
  booster: "💫",
  lotion: "💧",
  mist: "💨",
  serum: "✨",
  needleShot: "💉",
  eyeCream: "👁️",
  emulsion: "🥛",
  faceOil: "🫧",
  cream: "🫙",
  scrubPeeling: "🌾",
  pack: "🎭",
  rinseOffPack: "🪣",
  sunscreen: "🕶️",
  lipCare: "💋",
};
