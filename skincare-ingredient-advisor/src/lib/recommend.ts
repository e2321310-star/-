import type {
  BrandProduct,
  CareStep,
  CareVerdict,
  ConcernContribution,
  ConcernKey,
  CurrentRoutineItem,
  DiagnoseRecord,
  DiagnosisResult,
  ProductCategory,
  Roadmap,
  RoadmapStage,
  SkinType,
} from "./types";
import { CONCERN_LABELS, CONCERN_ORDER, SKIN_TYPE_LABELS } from "./types";

const TOP_N = 2;
const COLD_THRESHOLD_C = 15; // これ未満は乾燥に傾きやすいとみなす
const HOT_THRESHOLD_C = 28; // これ超は皮脂・テカリに傾きやすいとみなす
const SELF_CHECK_WEIGHT = 2;
const SCORE_PENALTY_PER_WEIGHT = 5; // 悩みの重み1につき肌点数を何点下げるか
const SCORE_MIN = 50;
const SCORE_MAX = 100;
const BASE_SKIN_AGE = 20; // 肌点数100のときの肌年齢（参考値）
const SKIN_AGE_SLOPE = 0.5; // 肌点数が1点下がるごとに肌年齢が何歳上がるか

// 朝は日焼け止めで仕上げる軽めのラインナップ、夜はパックを含む集中ケア
const AM_CATEGORIES: ProductCategory[] = ["lotion", "serum", "emulsion", "cream", "sunscreen"];
const PM_CATEGORIES: ProductCategory[] = ["lotion", "serum", "emulsion", "cream", "pack"];

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
  concerns: ConcernKey[],
  period: "am" | "pm"
): BrandProduct[] {
  const picked: BrandProduct[] = [];
  for (const concern of concerns) {
    const candidates = products.filter((p) => p.category === category && p.concern === concern);
    // その時間帯専用の商品があれば優先し、なければ朝晩兼用（未指定含む）の商品を使う
    const found =
      candidates.find((p) => p.period === period) ??
      candidates.find((p) => !p.period || p.period === "both") ??
      candidates[0];
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

function stepReason(category: ProductCategory, topConcerns: ConcernKey[], period: "am" | "pm"): string {
  const labels = topConcerns.map((c) => CONCERN_LABELS[c]).join("・");
  if (category === "sunscreen") {
    return `紫外線は色ムラ・乾燥・ハリ低下など多くの肌悩みを進行させる要因です。「${labels}」の対策の意味でも、日中のケアの仕上げに必ず取り入れましょう。`;
  }
  if (category === "pack") {
    return `「${labels}」の対策に向けて、週1〜2回の夜の集中ケアとして取り入れましょう。`;
  }
  if (period === "am") {
    return `「${labels}」の対策に向けて、日中の乾燥・くずれを防ぐケアとして取り入れましょう。`;
  }
  return `「${labels}」の対策に向けて、夜のあいだにしっかり補修するケアとして取り入れましょう。`;
}

function buildCareStep(
  category: ProductCategory,
  order: number,
  period: "am" | "pm",
  topConcerns: ConcernKey[],
  products: BrandProduct[],
  currentRoutine?: Partial<Record<ProductCategory, CurrentRoutineItem>>
): CareStep {
  const matched = pickProducts(products, category, topConcerns, period);
  const currentProduct = currentRoutine?.[category];
  const { verdict, reason: verdictReason } = judgeCurrentProduct(currentProduct, matched);
  const hasTimeSpecific = matched.some((p) => p.period === "am" || p.period === "pm");
  const sameEitherTime = matched.length > 0 && !hasTimeSpecific;
  const reason =
    stepReason(category, topConcerns, period) +
    (sameEitherTime && category !== "pack" && category !== "sunscreen"
      ? " この成分は低刺激で、朝でも夜でも使って問題ないため同じ内容にしています。"
      : "");
  return {
    category,
    order,
    reason,
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

function buildRoadmap(
  goalConcern: ConcernKey,
  goalNote: string | undefined,
  goalWeight: number,
  products: BrandProduct[]
): Roadmap {
  const label = CONCERN_LABELS[goalConcern];
  const sampleIngredient = products.find((p) => p.concern === goalConcern && p.category === "serum")?.ingredient;
  const ingredientHint = sampleIngredient ? `（例：${sampleIngredient}など）` : "";

  let stage: RoadmapStage;
  let stageLabel: string;
  let message: string;

  if (goalWeight <= 0) {
    stage = 1;
    stageLabel = "維持期";
    message = `今のところ「${label}」に強い乱れのサインは出ていません。今の基礎ケアを継続しつつ、予防的に${ingredientHint}を取り入れておくと目標に近づきやすくなります。`;
  } else if (goalWeight <= 3) {
    stage = 2;
    stageLabel = "対策開始期";
    message = `「${label}」の対策サインが出始めています。診断結果のケアに加えて、${ingredientHint}を意識的に取り入れ始めましょう。`;
  } else {
    stage = 3;
    stageLabel = "集中ケア期";
    message = `「${label}」の対策が今まさに必要な状態です。今日のおすすめケアには、この悩み向けの成分を優先的に反映しています。しばらく集中的にケアを続けましょう。`;
  }

  return { goalConcern, goalNote, stage, stageLabel, message };
}

export function buildDiagnosis(
  record: Pick<DiagnoseRecord, "concerns" | "skinType" | "temperatureC">,
  products: BrandProduct[],
  photoSignals?: Partial<Record<ConcernKey, number>>,
  currentRoutine?: Partial<Record<ProductCategory, CurrentRoutineItem>>,
  goal?: { concern: ConcernKey; note?: string }
): DiagnosisResult {
  const weights = new Map<ConcernKey, number>(CONCERN_ORDER.map((c) => [c, 0]));
  const sources = new Map<ConcernKey, string[]>(CONCERN_ORDER.map((c) => [c, []]));

  function addWeight(concern: ConcernKey, amount: number, source: string) {
    weights.set(concern, (weights.get(concern) ?? 0) + amount);
    sources.get(concern)?.push(source);
  }

  for (const concern of record.concerns) {
    addWeight(concern, SELF_CHECK_WEIGHT, "セルフチェックで選択");
  }
  for (const [concern, w] of Object.entries(skinTypeWeights(record.skinType)) as [
    ConcernKey,
    number
  ][]) {
    addWeight(concern, w, `肌質(${record.skinType ? SKIN_TYPE_LABELS[record.skinType] : ""})`);
  }
  for (const [concern, w] of Object.entries(temperatureWeights(record.temperatureC)) as [
    ConcernKey,
    number
  ][]) {
    addWeight(concern, w, `気温(${record.temperatureC}℃)`);
  }
  for (const [concern, w] of Object.entries(photoSignals ?? {}) as [ConcernKey, number][]) {
    addWeight(concern, w, "写真解析");
  }

  const rankedConcerns: ConcernContribution[] = Array.from(weights.entries())
    .filter(([, w]) => w > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([concern, weight]) => ({
      concern,
      weight,
      deduction: Math.round(weight * SCORE_PENALTY_PER_WEIGHT),
      sources: sources.get(concern) ?? [],
    }));

  const totalWeight = rankedConcerns.reduce((sum, r) => sum + r.weight, 0);
  const { skinScore, skinAge } = computeSkinScoreAndAge(totalWeight);
  const scoreExplanation = `満点100点から、気になる部位1つにつき${SELF_CHECK_WEIGHT * SCORE_PENALTY_PER_WEIGHT}点、肌質・気温・写真解析からの追加シグナル1つにつき${SCORE_PENALTY_PER_WEIGHT}点を目安に減点しています（最低${SCORE_MIN}点）。肌年齢は、肌点数100点を${BASE_SKIN_AGE}歳とし、点数が1点下がるごとに${SKIN_AGE_SLOPE}歳ずつ上げて計算した参考値です。`;

  const roadmap = goal
    ? buildRoadmap(goal.concern, goal.note, weights.get(goal.concern) ?? 0, products)
    : undefined;

  if (rankedConcerns.length === 0) {
    return { rankedConcerns: [], am: [], pm: [], skinScore, skinAge, scoreExplanation, roadmap };
  }

  const baseTopConcerns = rankedConcerns.slice(0, TOP_N).map((c) => c.concern);
  // 将来の目標にしている悩みは、今日のランキングに入っていなくても優先的にケアへ含める
  const topConcerns =
    goal && !baseTopConcerns.includes(goal.concern) ? [...baseTopConcerns, goal.concern] : baseTopConcerns;

  const am = AM_CATEGORIES.map((category, i) =>
    buildCareStep(category, i + 1, "am", topConcerns, products, currentRoutine)
  );
  const pm = PM_CATEGORIES.map((category, i) =>
    buildCareStep(category, i + 1, "pm", topConcerns, products, currentRoutine)
  );

  return { rankedConcerns, am, pm, skinScore, skinAge, scoreExplanation, roadmap };
}
