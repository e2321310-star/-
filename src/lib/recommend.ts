import type {
  CareStep,
  CareSuggestion,
  ConcernKey,
  DailyRecord,
  IngredientEntry,
  ScoreKey,
} from "./types";
import { CONCERN_LABELS, SCORE_ORDER } from "./types";

const RECENT_DAYS = 7;
const WEAK_THRESHOLD = 3.5; // これ未満の平均スコアを「不足傾向」とみなす
const SEVERE_THRESHOLD = 2.5; // これ未満ならパックなど強めのケアを提案

// 5段階評価の項目 -> 成分マッピング上の悩みキーへの変換
function scoreKeyToConcern(key: ScoreKey, dryLeaning: boolean): ConcernKey {
  switch (key) {
    case "pores":
      return "pores";
    case "unevenness":
      return "brightening";
    case "dryOil":
      return dryLeaning ? "dryness" : "oiliness";
    case "firmness":
      return "firmness";
    case "roughness":
      return "soothing";
  }
}

function average(nums: number[]): number {
  if (nums.length === 0) return 5;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function pickIngredientNames(
  concern: ConcernKey,
  ingredients: IngredientEntry[],
  limit = 2
): string[] {
  return ingredients
    .filter((i) => i.concern === concern)
    .slice(0, limit)
    .map((i) => i.name);
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function buildCareSuggestion(
  allRecords: DailyRecord[],
  ingredients: IngredientEntry[],
  days: number = RECENT_DAYS
): CareSuggestion {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const recent = allRecords.filter((r) => r.scores && r.date >= cutoffStr);

  if (recent.length === 0) {
    return { am: [], pm: [], weakConcerns: [], basedOnDays: 0 };
  }

  // 項目ごとの平均を算出
  const avgByKey: Record<ScoreKey, number> = {
    pores: average(recent.map((r) => r.scores!.pores)),
    unevenness: average(recent.map((r) => r.scores!.unevenness)),
    dryOil: average(recent.map((r) => r.scores!.dryOil)),
    firmness: average(recent.map((r) => r.scores!.firmness)),
    roughness: average(recent.map((r) => r.scores!.roughness)),
  };

  // 乾燥/テカリの方向性は、直近の記録のうち方向が記録されているものの多数決
  const directions = recent
    .map((r) => r.scores!.dryOilDirection)
    .filter((d): d is NonNullable<typeof d> => !!d && d !== "balanced");
  const dryCount = directions.filter((d) => d === "dry").length;
  const oilyCount = directions.filter((d) => d === "oily").length;
  const dryLeaning = dryCount >= oilyCount; // 同数 or 不明なら乾燥寄りとして保湿を優先

  const avgByConcern = new Map<ConcernKey, number>();
  for (const key of SCORE_ORDER) {
    const concern = scoreKeyToConcern(key, dryLeaning);
    const avg = avgByKey[key];
    // dryOil は方向によって dryness/oiliness どちらかにしか反映しないため上書きでOK
    avgByConcern.set(concern, avg);
  }

  const weakConcerns = Array.from(avgByConcern.entries())
    .filter(([, avg]) => avg < WEAK_THRESHOLD)
    .sort((a, b) => a[1] - b[1])
    .map(([concern, avg]) => ({ concern, avg }));

  const topConcerns = weakConcerns.slice(0, 2).map((w) => w.concern);
  const worst = weakConcerns[0];

  const roughnessFlagged = weakConcerns.some((w) => w.concern === "soothing");
  const oilinessFlagged = weakConcerns.some((w) => w.concern === "oiliness");
  const drynessFlagged = weakConcerns.some((w) => w.concern === "dryness");

  function serumStep(): CareStep {
    if (topConcerns.length === 0) {
      return {
        category: "serum",
        reason: "直近の評価は良好です。現状のケアを維持しましょう。",
        ingredients: [],
      };
    }
    const names = uniq(topConcerns.flatMap((c) => pickIngredientNames(c, ingredients, 2)));
    const labels = topConcerns.map((c) => CONCERN_LABELS[c]).join("・");
    return {
      category: "serum",
      reason: `直近${days}日で「${labels}」の評価が低めです。重点ケアとして取り入れましょう。`,
      ingredients: names,
    };
  }

  function washStep(isPM: boolean): CareStep {
    if (roughnessFlagged) {
      return {
        category: "wash",
        reason: "肌荒れ傾向のため、低刺激なアミノ酸系洗浄料で優しく洗いましょう。",
        ingredients: pickIngredientNames("soothing", ingredients, 2),
      };
    }
    if (oilinessFlagged && isPM) {
      return {
        category: "wash",
        reason: "皮脂・テカリが気になるため、皮脂吸着系の洗顔料がおすすめです。",
        ingredients: pickIngredientNames("oiliness", ingredients, 1),
      };
    }
    return {
      category: "wash",
      reason: "肌に合った洗顔料で、こすらず優しく洗いましょう。",
      ingredients: [],
    };
  }

  function lotionStep(): CareStep {
    if (drynessFlagged) {
      return {
        category: "lotion",
        reason: "乾燥傾向のため、保湿力の高い化粧水でしっかり水分補給しましょう。",
        ingredients: pickIngredientNames("dryness", ingredients, 2),
      };
    }
    if (weakConcerns.some((w) => w.concern === "brightening")) {
      return {
        category: "lotion",
        reason: "色ムラが気になるため、美白系化粧水で透明感をケアしましょう。",
        ingredients: pickIngredientNames("brightening", ingredients, 2),
      };
    }
    return {
      category: "lotion",
      reason: "土台の保湿を整えるため、化粧水でうるおいを補いましょう。",
      ingredients: ["グリセリン", "ヒアルロン酸"],
    };
  }

  function creamStep(): CareStep {
    const base = pickIngredientNames("dryness", ingredients, 2);
    if (roughnessFlagged) {
      return {
        category: "cream",
        reason: "バリア機能をサポートし、外部刺激から肌を守りましょう。",
        ingredients: uniq([...pickIngredientNames("soothing", ingredients, 1), ...base]),
      };
    }
    return {
      category: "cream",
      reason: "水分の蒸散を防ぐフタをして、うるおいを閉じ込めましょう。",
      ingredients: base,
    };
  }

  function packStep(): CareStep | null {
    if (!worst || worst.avg >= SEVERE_THRESHOLD) return null;
    const names = pickIngredientNames(worst.concern, ingredients, 2);
    return {
      category: "pack",
      reason: `「${CONCERN_LABELS[worst.concern]}」の評価が特に低いため、週1〜2回の集中ケアを検討しましょう。`,
      ingredients: names,
    };
  }

  const am: CareStep[] = [washStep(false), lotionStep(), serumStep(), creamStep()];

  const pm: CareStep[] = [
    {
      category: "cleansing",
      reason: "1日の汚れ・皮脂をオフし、その後のケアの浸透を助けます。",
      ingredients: [],
    },
    washStep(true),
    lotionStep(),
    serumStep(),
    creamStep(),
  ];
  const pack = packStep();
  if (pack) pm.push(pack);

  return { am, pm, weakConcerns, basedOnDays: recent.length };
}
