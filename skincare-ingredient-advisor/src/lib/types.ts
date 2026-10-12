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

// ---------- 肌タイプ診断（簡易チェック） ----------
// 将来「肌タイプ別のおすすめ化粧品」を出す予定があるため、判定結果は文字列の自由入力ではなく
// 定数で管理する。「敏感肌」は上記SkinTypeとは異なり、他の4タイプと排他ではない「傾向フラグ」として
// 別に持つ（例: dry + sensitive=true → 画面表示は「乾燥肌（敏感肌の傾向あり）」）。
export type FullSkinType = "normal" | "dry" | "oily" | "combination";

export const FULL_SKIN_TYPE_LABELS: Record<FullSkinType, string> = {
  normal: "普通肌",
  dry: "乾燥肌",
  oily: "脂性肌（オイリー肌）",
  combination: "混合肌",
};

export const FULL_SKIN_TYPE_ORDER: FullSkinType[] = ["normal", "dry", "oily", "combination"];

export interface SkinTypeQuizScores {
  dryness: number;
  oiliness: number;
  sensitivity: number;
  zoneDiff: number; // Tゾーンと頬の差（大きいほど混合肌寄り）
}

export interface SkinTypeDiagnosis {
  skinType: FullSkinType;
  sensitive: boolean; // 敏感肌の傾向があるか（別フラグ）
  scores: SkinTypeQuizScores;
  diagnosedAt: string; // ISO
}

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

// ---------- 初回オンボーディング ----------

export type AgeBand = "teens" | "early20s" | "late20s" | "30s" | "40s";

export const AGE_BAND_LABELS: Record<AgeBand, string> = {
  teens: "10代",
  early20s: "20代前半",
  late20s: "20代後半",
  "30s": "30代",
  "40s": "40代",
};

export const AGE_BAND_ORDER: AgeBand[] = ["teens", "early20s", "late20s", "30s", "40s"];

// オンボーディングの悩み選択（セルフチェックのConcernKeyとは別に、初心者にも分かりやすい言葉で用意）
export type OnboardingConcern = "acne" | "pores" | "dryness" | "dullness" | "spots";

export const ONBOARDING_CONCERN_LABELS: Record<OnboardingConcern, string> = {
  acne: "ニキビ",
  pores: "毛穴",
  dryness: "乾燥",
  dullness: "くすみ",
  spots: "シミ",
};

export const ONBOARDING_CONCERN_ORDER: OnboardingConcern[] = ["acne", "pores", "dryness", "dullness", "spots"];

export type SkincareExperience = "beginner" | "some" | "daily";

export const EXPERIENCE_LABELS: Record<SkincareExperience, string> = {
  beginner: "ほぼ初めて",
  some: "少しやっている",
  daily: "毎日やっている",
};

export const EXPERIENCE_ORDER: SkincareExperience[] = ["beginner", "some", "daily"];

export type InterestScope = "skincare_only" | "skincare_and_aesthetic";

export const INTEREST_SCOPE_LABELS: Record<InterestScope, string> = {
  skincare_only: "スキンケアのみ",
  skincare_and_aesthetic: "美容医療・整形にも興味あり",
};

export const INTEREST_SCOPE_ORDER: InterestScope[] = ["skincare_only", "skincare_and_aesthetic"];

// 月の予算感（3段階）。商品データのpriceRangeや、美容医療カテゴリのコスト帯の絞り込みに使う
export type Budget = "petit" | "standard" | "premium";

export const BUDGET_LABELS: Record<Budget, string> = {
  petit: "プチプラ（〜3,000円/月）",
  standard: "スタンダード（3,000〜10,000円/月）",
  premium: "こだわり（10,000円〜/月）",
};

export const BUDGET_SHORT_LABELS: Record<Budget, string> = {
  petit: "プチプラ",
  standard: "スタンダード",
  premium: "こだわり",
};

export const BUDGET_ORDER: Budget[] = ["petit", "standard", "premium"];

// 予算帯ごとに、どのPriceRangeまでを表示対象にするか（その予算帯以下はすべて含む）
export const BUDGET_TO_PRICE_RANGES: Record<Budget, PriceRange[]> = {
  petit: ["budget"],
  standard: ["budget", "mid"],
  premium: ["budget", "mid", "premium"],
};

export type ProductCategory =
  | "cleansing"
  | "faceWash"
  | "lotion"
  | "serum"
  | "needleShot"
  | "emulsion"
  | "faceOil"
  | "cream"
  | "rinseOffPack"
  | "sunscreen";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cleansing: "クレンジング",
  faceWash: "洗顔料",
  lotion: "化粧水",
  serum: "美容液",
  needleShot: "ニードルショット",
  emulsion: "乳液",
  faceOil: "フェイスオイル",
  cream: "クリーム",
  rinseOffPack: "洗い流すパック",
  sunscreen: "日焼け止め",
};

// スキンケアの一般的な使用順（軽いテクスチャ→重いテクスチャ、ニードルショットはピンポイントの集中補修、
// 洗い流すパックは週1〜2回の集中ケア、日焼け止めは朝の仕上げ）
export const CATEGORY_ORDER: ProductCategory[] = [
  "cleansing",
  "faceWash",
  "lotion",
  "serum",
  "needleShot",
  "emulsion",
  "faceOil",
  "cream",
  "rinseOffPack",
  "sunscreen",
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

  // 初回オンボーディングで入力する項目（設定画面からも後で変更できる）
  onboardingCompleted?: boolean;
  ageBand?: AgeBand;
  onboardingConcerns?: OnboardingConcern[];
  skincareExperience?: SkincareExperience;
  interestScope?: InterestScope;
  budget?: Budget;

  // 肌タイプ診断（簡易チェック）の結果。再診断すると上書きされる
  skinTypeDiagnosis?: SkinTypeDiagnosis;
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
