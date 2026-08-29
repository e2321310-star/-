// 気になる部位（セルフチェックのタップ対象）＝悩みのキーでもある
export type ConcernKey =
  | "pores" // 毛穴
  | "brightening" // 色ムラ・美白
  | "dryness" // 乾燥
  | "oiliness" // テカリ・皮脂
  | "firmness" // ハリ
  | "soothing"; // 肌荒れ・鎮静

export const CONCERN_LABELS: Record<ConcernKey, string> = {
  pores: "毛穴",
  brightening: "色ムラ",
  dryness: "乾燥",
  oiliness: "テカリ",
  firmness: "ハリ",
  soothing: "肌荒れ",
};

export const CONCERN_ORDER: ConcernKey[] = [
  "pores",
  "brightening",
  "dryness",
  "oiliness",
  "firmness",
  "soothing",
];

export type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive";

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  dry: "乾燥肌",
  oily: "脂性肌",
  combination: "混合肌",
  normal: "普通肌",
  sensitive: "敏感肌",
};

export const SKIN_TYPE_ORDER: SkinType[] = ["dry", "oily", "combination", "normal", "sensitive"];

export type Gender = "female" | "male" | "no_answer";

export const GENDER_LABELS: Record<Gender, string> = {
  female: "女性",
  male: "男性",
  no_answer: "回答しない",
};

export const GENDER_ORDER: Gender[] = ["female", "male", "no_answer"];

export type ProductCategory = "lotion" | "serum" | "cream" | "emulsion" | "pack";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  lotion: "化粧水",
  serum: "美容液",
  cream: "クリーム",
  emulsion: "乳液",
  pack: "パック",
};

// スキンケアの一般的な使用順（軽いテクスチャ→重いテクスチャ、パックは仕上げの集中ケア）
export const CATEGORY_ORDER: ProductCategory[] = ["lotion", "serum", "emulsion", "cream", "pack"];

// 診断記録：撮影・セルフチェック・気温・肌質を1日1件で保存
export interface DiagnoseRecord {
  date: string; // "YYYY-MM-DD" (主キー)
  photo?: Blob;
  concerns: ConcernKey[]; // 気になる部位として選択したもの
  temperatureC?: number;
  skinType?: SkinType;
  updatedAt: string; // ISO
}

// 成分×ブランド商品データ
export interface BrandProduct {
  id?: number; // autoIncrement
  concern: ConcernKey;
  category: ProductCategory;
  ingredient: string; // 成分名
  brand: string;
  name: string; // 商品名
  note?: string;
}

// 今使っているスキンケア（カテゴリごとに1つ）
export interface CurrentRoutineItem {
  brand: string;
  name: string;
}

// プロフィール（設定画面）
export interface Profile {
  id: "default";
  skinType?: SkinType;
  favoriteBrands?: string;
  currentRoutine?: Partial<Record<ProductCategory, CurrentRoutineItem>>;
  age?: number;
  gender?: Gender;
}

export type CareVerdict = "keep" | "change" | "no-data";

export interface DiagnosisResult {
  rankedConcerns: { concern: ConcernKey; weight: number }[];
  am: CareStep[];
  pm: CareStep[];
  skinScore: number; // 0-100（高いほど良好）
  skinAge: number; // 参考値としての肌年齢
}

export interface CareStep {
  category: ProductCategory;
  order: number; // 使う順番（1〜）
  reason: string;
  products: BrandProduct[];
  currentProduct?: CurrentRoutineItem;
  verdict: CareVerdict;
  verdictReason: string;
}
