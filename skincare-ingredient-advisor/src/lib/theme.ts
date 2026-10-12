import type { ConcernKey, ProductCategory, ProductRegion } from "./types";
import type { IconName } from "@/components/icons";

// 白ベース・1アクセントカラーの共通テーマに合わせ、悩み・産地による色分けは行わない。
// 「選択中/強調」はすべて同じアクセントカラー、それ以外は中立なグレーで表す。
export const CONCERN_BADGE_CLASS: Record<ConcernKey, string> = {
  pores: "bg-[var(--accent)] text-[var(--accent-contrast)]",
  brightening: "bg-[var(--accent)] text-[var(--accent-contrast)]",
  dryness: "bg-[var(--accent)] text-[var(--accent-contrast)]",
  oiliness: "bg-[var(--accent)] text-[var(--accent-contrast)]",
  firmness: "bg-[var(--accent)] text-[var(--accent-contrast)]",
  soothing: "bg-[var(--accent)] text-[var(--accent-contrast)]",
};

export const CONCERN_DOT_CLASS: Record<ConcernKey, string> = {
  pores: "bg-[var(--accent)]",
  brightening: "bg-[var(--accent)]",
  dryness: "bg-[var(--accent)]",
  oiliness: "bg-[var(--accent)]",
  firmness: "bg-[var(--accent)]",
  soothing: "bg-[var(--accent)]",
};

// 産地タグは色分けせず、同じ中立なグレーのバッジで表示する
export const PRODUCT_REGION_BADGE_CLASS: Record<ProductRegion, string> = {
  jp: "bg-[var(--card)] text-[var(--foreground-muted)]",
  kr: "bg-[var(--card)] text-[var(--foreground-muted)]",
  west: "bg-[var(--card)] text-[var(--foreground-muted)]",
};

// カテゴリアイコン（絵文字ではなく線画アイコン名を参照する）
export const CATEGORY_ICON: Record<ProductCategory, IconName> = {
  cleansing: "bottle",
  faceWash: "droplet",
  lotion: "droplet",
  serum: "sparkle",
  needleShot: "syringe",
  emulsion: "jar",
  faceOil: "droplet",
  cream: "jar",
  rinseOffPack: "bucket",
  sunscreen: "shield",
};
