// 自己評価5項目のキー。すべて「良いほど5、悪いほど1」で統一する。
export type ScoreKey =
  | "pores" // 毛穴の目立たなさ
  | "unevenness" // 透明感・色ムラのなさ
  | "dryOil" // 乾燥/テカリのなさ（バランス）
  | "firmness" // ハリ
  | "roughness"; // 肌荒れのなさ

export type ScoreValue = 1 | 2 | 3 | 4 | 5;

// 乾燥/テカリ項目は方向性があるため、スコアが低いときだけ内訳を記録する
export type DryOilDirection = "dry" | "oily" | "balanced";

export type Scores = Record<ScoreKey, ScoreValue> & {
  dryOilDirection?: DryOilDirection;
};

export interface DailyRecord {
  date: string; // "YYYY-MM-DD" (主キー)
  photo?: Blob;
  photoTakenAt?: string; // ISO
  memo?: string;
  scores?: Scores;
  updatedAt: string; // ISO
}

// 悩み（成分マッピングの単位）
export type ConcernKey =
  | "pores" // 毛穴
  | "brightening" // 美白・色ムラ
  | "dryness" // 乾燥
  | "oiliness" // 皮脂・テカリ
  | "firmness" // ハリ・エイジング
  | "soothing"; // 肌荒れ・鎮静

export interface IngredientEntry {
  id?: number; // autoIncrement
  concern: ConcernKey;
  name: string;
  description: string;
}

export type CareCategory =
  | "cleansing" // クレンジング
  | "wash" // 洗顔
  | "lotion" // 化粧水
  | "serum" // 美容液
  | "cream" // クリーム
  | "pack"; // パック

export interface CareStep {
  category: CareCategory;
  reason: string;
  ingredients: string[];
}

export interface CareSuggestion {
  am: CareStep[];
  pm: CareStep[];
  weakConcerns: { concern: ConcernKey; avg: number }[];
  basedOnDays: number;
}

export const SCORE_LABELS: Record<ScoreKey, string> = {
  pores: "毛穴の目立たなさ",
  unevenness: "透明感・色ムラのなさ",
  dryOil: "乾燥/テカリのなさ",
  firmness: "ハリ",
  roughness: "肌荒れのなさ",
};

export const SCORE_ORDER: ScoreKey[] = [
  "pores",
  "unevenness",
  "dryOil",
  "firmness",
  "roughness",
];

export const CONCERN_LABELS: Record<ConcernKey, string> = {
  pores: "毛穴",
  brightening: "美白・色ムラ",
  dryness: "乾燥",
  oiliness: "皮脂・テカリ",
  firmness: "ハリ・エイジング",
  soothing: "肌荒れ・鎮静",
};

export const CARE_CATEGORY_LABELS: Record<CareCategory, string> = {
  cleansing: "クレンジング",
  wash: "洗顔",
  lotion: "化粧水",
  serum: "美容液",
  cream: "クリーム",
  pack: "パック",
};
