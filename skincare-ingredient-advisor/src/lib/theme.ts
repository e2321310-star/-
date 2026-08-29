import type { ConcernKey, ProductCategory } from "./types";

// 悩みごとに色分けし、画面全体で一貫した配色にする
export const CONCERN_BADGE_CLASS: Record<ConcernKey, string> = {
  pores: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  brightening: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  dryness: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  oiliness: "bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300",
  firmness: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  soothing: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
};

export const CONCERN_DOT_CLASS: Record<ConcernKey, string> = {
  pores: "bg-amber-500",
  brightening: "bg-rose-500",
  dryness: "bg-sky-500",
  oiliness: "bg-lime-500",
  firmness: "bg-violet-500",
  soothing: "bg-emerald-500",
};

export const CATEGORY_ICON: Record<ProductCategory, string> = {
  lotion: "💧",
  serum: "✨",
  cream: "🫙",
  emulsion: "🥛",
  pack: "🎭",
};
