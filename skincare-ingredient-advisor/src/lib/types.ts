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

// 忙しさ・メイクの有無など、朝晩のケア内容を調整するためのライフスタイル
export type Lifestyle = "time_saving" | "makeup_heavy" | "balanced";

export const LIFESTYLE_LABELS: Record<Lifestyle, string> = {
  time_saving: "忙しい・時短派",
  makeup_heavy: "毎日しっかりメイクする",
  balanced: "特にこだわりなし",
};

export const LIFESTYLE_ORDER: Lifestyle[] = ["time_saving", "makeup_heavy", "balanced"];

export type ProductCategory =
  | "cleansing"
  | "faceWash"
  | "booster"
  | "lotion"
  | "mist"
  | "serum"
  | "needleShot"
  | "eyeCream"
  | "emulsion"
  | "faceOil"
  | "cream"
  | "scrubPeeling"
  | "pack"
  | "rinseOffPack"
  | "sunscreen"
  | "lipCare";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cleansing: "クレンジング",
  faceWash: "洗顔料",
  booster: "ブースター・導入液",
  lotion: "化粧水",
  mist: "ミスト",
  serum: "美容液",
  needleShot: "ニードルショット",
  eyeCream: "アイクリーム",
  emulsion: "乳液",
  faceOil: "フェイスオイル",
  cream: "クリーム",
  scrubPeeling: "スクラブ・ピーリング",
  pack: "シートマスク",
  rinseOffPack: "洗い流すパック",
  sunscreen: "日焼け止め",
  lipCare: "リップケア",
};

// スキンケアの一般的な使用順（軽いテクスチャ→重いテクスチャ、ニードルショットはピンポイントの集中補修、
// スクラブ/パック類は週1〜2回の集中ケア、日焼け止めは朝の仕上げ）
export const CATEGORY_ORDER: ProductCategory[] = [
  "cleansing",
  "faceWash",
  "booster",
  "lotion",
  "mist",
  "serum",
  "needleShot",
  "eyeCream",
  "emulsion",
  "faceOil",
  "cream",
  "scrubPeeling",
  "pack",
  "rinseOffPack",
  "sunscreen",
  "lipCare",
];

// 商品の産地（海外ブランドをひと目でわかるようにするための任意タグ）
export type ProductRegion = "jp" | "kr" | "west";

export const PRODUCT_REGION_LABELS: Record<ProductRegion, string> = {
  jp: "🇯🇵 国産",
  kr: "🇰🇷 韓国",
  west: "🌍 欧米",
};

// 診断記録：撮影・セルフチェック・気温・肌質を1日1件で保存
export interface DiagnoseRecord {
  date: string; // "YYYY-MM-DD" (主キー)
  photo?: Blob;
  concerns: ConcernKey[]; // 気になる部位として選択したもの
  temperatureC?: number;
  skinType?: SkinType;
  updatedAt: string; // ISO
}

// 朝夜どちらの使用に向くか（未指定は"both"扱い＝朝晩どちらでもOK）
export type CarePeriod = "am" | "pm" | "both";

export const PERIOD_LABELS: Record<CarePeriod, string> = {
  am: "☀️ 朝向け",
  pm: "🌙 夜向け",
  both: "朝晩どちらでも",
};

// 価格帯の目安（実売価格は変動するため、大まかな区分のみ保持する）
export type PriceRange = "budget" | "mid" | "premium";

export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  budget: "💴 プチプラ",
  mid: "💴💴 ミドル",
  premium: "💴💴💴 デパコス",
};

// 成分×ブランド商品データ
export interface BrandProduct {
  id?: number; // autoIncrement
  concern: ConcernKey;
  category: ProductCategory;
  ingredient: string; // 成分名
  brand: string;
  name: string; // 商品名
  note?: string;
  period?: CarePeriod;
  priceRange?: PriceRange;
  price?: string; // 実売価格（自由入力、例："1,320円"）
  link?: string; // 購入ページなどのURL（自由入力）
  region?: ProductRegion; // 産地タグ（未指定は国産として扱う）
}

// 今使っているスキンケア（カテゴリ×朝晩ごとに1つ。クレンジングのように片方しか
// 使わないカテゴリでも、該当する方のキーにだけ値が入る）
export interface CurrentRoutineItem {
  brand: string;
  name: string;
}

export type CurrentRoutineByPeriod = Partial<Record<"am" | "pm", CurrentRoutineItem>>;

// プロフィール画面のデータ
export interface Profile {
  id: "default";
  skinType?: SkinType;
  favoriteBrands?: string;
  currentRoutine?: Partial<Record<ProductCategory, CurrentRoutineByPeriod>>;
  age?: number;
  gender?: Gender;
  lifestyle?: Lifestyle; // 忙しさ・メイクの有無など
  goalConcern?: ConcernKey; // 将来なりたい肌の目標
  goalNote?: string; // 目標の自由入力メモ
}

export type CareVerdict = "keep" | "change" | "no-data";

export type RoadmapStage = 1 | 2 | 3;

export interface Roadmap {
  goalConcern: ConcernKey;
  goalNote?: string;
  stage: RoadmapStage;
  stageLabel: string;
  message: string;
}

export interface ConcernContribution {
  concern: ConcernKey;
  weight: number;
  deduction: number; // 肌点数からのマイナス分
  sources: string[]; // この悩みの重みに寄与した理由（セルフチェック/肌質/気温/写真解析）
}

export interface DiagnosisResult {
  rankedConcerns: ConcernContribution[];
  am: CareStep[];
  pm: CareStep[];
  skinScore: number; // 0-100（高いほど良好）
  skinAge: number; // 参考値としての肌年齢
  scoreExplanation: string; // 肌点数・肌年齢の算出方法の説明
  roadmap?: Roadmap;
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
