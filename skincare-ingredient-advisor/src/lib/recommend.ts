import type {
  BrandProduct,
  CareStep,
  CareVerdict,
  ConcernKey,
  CurrentRoutineItem,
  DiagnoseRecord,
  DiagnosisResult,
  ProductCategory,
  SkinType,
} from "./types";
import { CATEGORY_ORDER, CONCERN_LABELS, CONCERN_ORDER } from "./types";

const TOP_N = 2;
const COLD_THRESHOLD_C = 15; // これ未満は乾燥に傾きやすいとみなす
const HOT_THRESHOLD_C = 28; // これ超は皮脂・テカリに傾きやすいとみなす
const SCORE_PENALTY_PER_WEIGHT = 5; // 悩みの重み1につき肌点数を何点下げるか
const SCORE_MIN = 50;
const SCORE_MAX = 100;
const BASE_SKIN_AGE = 20; // 肌点数100のときの肌年齢（参考値）
const SKIN_AGE_SLOPE = 0.5; // 肌点数が1点下がるごとに肌年齢が何歳上がるか

function skinTypeWeights(skinType?: SkinType): Partial<Record<ConcernKey, number>> {
  switch (skinType) {
    case "dry":
      return { dryness: 1 };
    case "oily":
      return { oiliness: 1 };
    case "combination":
      return { dryness: 0.5, oiliness: 0.5 };
    case "sensitive":
      return { soothing: 1 };
    case "normal":
    default:
      return {};
  }
}

function temperatureWeights(temperatureC?: number): Partial<Record<ConcernKey, number>> {
  if (temperatureC == null) return {};
  if (temperatureC < COLD_THRESHOLD_C) return { dryness: 1 };
  if (temperatureC > HOT_THRESHOLD_C) return { oiliness: 1 };
  return {};
}

function pickProducts(
  products: BrandProduct[],
  category: ProductCategory,
  concerns: ConcernKey[]
): BrandProduct[] {
  const picked: BrandProduct[] = [];
  for (const concern of concerns) {
    const found = products.find((p) => p.category === category && p.concern === concern);
    if (found && !picked.some((p) => p.id === found.id)) picked.push(found);
  }
  return picked;
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function judgeCurrentProduct(
  current: CurrentRoutineItem | undefined,
  recommended: BrandProduct[]
): { verdict: CareVerdict; reason: string } {
  if (!current || (!current.brand.trim() && !current.name.trim())) {
    return { verdict: "no-data", reason: "今使っている商品が未入力です。設定画面から入力すると判定できます。" };
  }
  if (recommended.length === 0) {
    return { verdict: "no-data", reason: "比較できる商品データがまだ登録されていません。" };
  }
  const label = `${current.brand} ${current.name}`.trim();
  const brand = normalize(current.brand);
  const name = normalize(current.name);
  const matched = recommended.some((p) => {
    const pBrand = normalize(p.brand);
    const pName = normalize(p.name);
    const brandMatch = !!brand && (pBrand.includes(brand) || brand.includes(pBrand));
    const nameMatch = !!name && (pName.includes(name) || name.includes(pName));
    return brandMatch || nameMatch;
  });
  if (matched) {
    return {
      verdict: "keep",
      reason: `今お使いの「${label}」はおすすめの内容と近いので、現状維持でOKです。`,
    };
  }
  return {
    verdict: "change",
    reason: `今お使いの「${label}」よりも、上記のおすすめ商品への見直しを検討してもよさそうです。`,
  };
}

function buildCareStep(
  category: ProductCategory,
  order: number,
  topConcerns: ConcernKey[],
  products: BrandProduct[],
  currentRoutine?: Partial<Record<ProductCategory, CurrentRoutineItem>>
): CareStep {
  const matched = pickProducts(products, category, topConcerns);
  const labels = topConcerns.map((c) => CONCERN_LABELS[c]).join("・");
  const freqNote = category === "pack" ? "週1〜2回の集中ケアとして" : "毎日のケアとして";
  const currentProduct = currentRoutine?.[category];
  const { verdict, reason: verdictReason } = judgeCurrentProduct(currentProduct, matched);
  return {
    category,
    order,
    reason: `「${labels}」の対策に向けて、${freqNote}取り入れましょう。`,
    products: matched,
    currentProduct,
    verdict,
    verdictReason,
  };
}

function computeSkinScoreAndAge(totalWeight: number): { skinScore: number; skinAge: number } {
  const skinScore = Math.min(
    SCORE_MAX,
    Math.max(SCORE_MIN, Math.round(SCORE_MAX - totalWeight * SCORE_PENALTY_PER_WEIGHT))
  );
  const skinAge = Math.round(BASE_SKIN_AGE + (SCORE_MAX - skinScore) * SKIN_AGE_SLOPE);
  return { skinScore, skinAge };
}

export function buildDiagnosis(
  record: Pick<DiagnoseRecord, "concerns" | "skinType" | "temperatureC">,
  products: BrandProduct[],
  photoSignals?: Partial<Record<ConcernKey, number>>,
  currentRoutine?: Partial<Record<ProductCategory, CurrentRoutineItem>>
): DiagnosisResult {
  const weights = new Map<ConcernKey, number>(CONCERN_ORDER.map((c) => [c, 0]));

  for (const concern of record.concerns) {
    weights.set(concern, (weights.get(concern) ?? 0) + 2);
  }
  for (const [concern, w] of Object.entries(skinTypeWeights(record.skinType)) as [
    ConcernKey,
    number
  ][]) {
    weights.set(concern, (weights.get(concern) ?? 0) + w);
  }
  for (const [concern, w] of Object.entries(temperatureWeights(record.temperatureC)) as [
    ConcernKey,
    number
  ][]) {
    weights.set(concern, (weights.get(concern) ?? 0) + w);
  }
  for (const [concern, w] of Object.entries(photoSignals ?? {}) as [ConcernKey, number][]) {
    weights.set(concern, (weights.get(concern) ?? 0) + w);
  }

  const rankedConcerns = Array.from(weights.entries())
    .filter(([, w]) => w > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([concern, weight]) => ({ concern, weight }));

  const totalWeight = rankedConcerns.reduce((sum, r) => sum + r.weight, 0);
  const { skinScore, skinAge } = computeSkinScoreAndAge(totalWeight);

  if (rankedConcerns.length === 0) {
    return { rankedConcerns: [], am: [], pm: [], skinScore, skinAge };
  }

  const topConcerns = rankedConcerns.slice(0, TOP_N).map((c) => c.concern);
  const steps = CATEGORY_ORDER.map((category, i) =>
    buildCareStep(category, i + 1, topConcerns, products, currentRoutine)
  );

  return { rankedConcerns, am: steps, pm: steps, skinScore, skinAge };
}
