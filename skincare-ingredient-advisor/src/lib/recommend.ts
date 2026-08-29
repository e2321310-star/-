import type {
  BrandProduct,
  CareStep,
  ConcernKey,
  DiagnoseRecord,
  DiagnosisResult,
  ProductCategory,
  SkinType,
} from "./types";
import { CATEGORY_ORDER, CONCERN_LABELS, CONCERN_ORDER } from "./types";

const TOP_N = 2;
const COLD_THRESHOLD_C = 15; // これ未満は乾燥に傾きやすいとみなす
const HOT_THRESHOLD_C = 28; // これ超は皮脂・テカリに傾きやすいとみなす

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

function buildCareStep(
  category: ProductCategory,
  topConcerns: ConcernKey[],
  products: BrandProduct[]
): CareStep {
  const matched = pickProducts(products, category, topConcerns);
  const labels = topConcerns.map((c) => CONCERN_LABELS[c]).join("・");
  const freqNote = category === "pack" ? "週1〜2回の集中ケアとして" : "毎日のケアとして";
  return {
    category,
    reason: `「${labels}」の対策に向けて、${freqNote}取り入れましょう。`,
    products: matched,
  };
}

export function buildDiagnosis(
  record: Pick<DiagnoseRecord, "concerns" | "skinType" | "temperatureC">,
  products: BrandProduct[],
  photoSignals?: Partial<Record<ConcernKey, number>>
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

  if (rankedConcerns.length === 0) {
    return { rankedConcerns: [], am: [], pm: [] };
  }

  const topConcerns = rankedConcerns.slice(0, TOP_N).map((c) => c.concern);
  const steps = CATEGORY_ORDER.map((category) => buildCareStep(category, topConcerns, products));

  return { rankedConcerns, am: steps, pm: steps };
}
