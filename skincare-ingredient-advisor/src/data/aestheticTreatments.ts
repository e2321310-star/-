import type { Budget } from "@/lib/types";

// 施術のカテゴリ（固定5種）
export type AestheticCategory = "doubleEyelid" | "nose" | "skinTreatment" | "hairRemoval" | "botox";

export const AESTHETIC_CATEGORY_LABELS: Record<AestheticCategory, string> = {
  doubleEyelid: "二重",
  nose: "鼻",
  skinTreatment: "肌治療",
  hairRemoval: "脱毛",
  botox: "ボトックス",
};

export const AESTHETIC_CATEGORY_ICON: Record<AestheticCategory, string> = {
  doubleEyelid: "👁️",
  nose: "👃",
  skinTreatment: "🩹",
  hairRemoval: "✨",
  botox: "💉",
};

export const AESTHETIC_CATEGORY_ORDER: AestheticCategory[] = [
  "doubleEyelid",
  "nose",
  "skinTreatment",
  "hairRemoval",
  "botox",
];

export interface AestheticTreatment {
  id: string;
  category: AestheticCategory;
  name: string;
  overview: string; // 概要（効果を断定しない中立的な説明）
  costRangeText: string; // 目安費用
  budgetTier: Budget;
  downtimeText: string; // ダウンタイムの目安
  cautionNote: string; // リスク・副作用などの注意事項
}

// 医療広告ガイドラインを踏まえ、効果を保証・断定する表現やビフォーアフター画像は使わず、
// 一般的な施術内容・費用目安・ダウンタイム・リスクの説明にとどめている（あくまで参考情報）。
export const AESTHETIC_TREATMENTS: AestheticTreatment[] = [
  {
    id: "double-eyelid-suture",
    category: "doubleEyelid",
    name: "二重埋没法",
    overview:
      "まぶたの裏側を医療用の糸で留めて、二重のラインをつくる施術です。切開を伴わないタイプとして広く行われています。",
    costRangeText: "両目で目安 30,000円〜150,000円程度（クリニック・糸の本数により異なります）",
    budgetTier: "standard",
    downtimeText: "施術後数日〜1週間程度、腫れやむくみが出ることがあります。",
    cautionNote:
      "見え方や持続期間には個人差があります。まれに糸が取れる・感染などが起こることもあるため、事前にリスクの説明を十分に受けてください。",
  },
  {
    id: "nose-filler",
    category: "nose",
    name: "鼻のヒアルロン酸注入",
    overview: "ヒアルロン酸を注入し、鼻のラインを一時的に整える施術です。",
    costRangeText: "1回あたり目安 30,000円〜150,000円程度",
    budgetTier: "premium",
    downtimeText: "当日〜数日程度、腫れや内出血が出ることがあります。",
    cautionNote:
      "効果は数ヶ月〜1年程度で徐々に薄れるとされています。まれに血流障害など重篤な合併症の報告もあるため、経験のある医師のもとで受けることが重要です。",
  },
  {
    id: "skin-laser-pigmentation",
    category: "skinTreatment",
    name: "レーザーによるシミ治療",
    overview: "レーザーを照射し、シミや色素沈着にアプローチする施術です。",
    costRangeText: "1箇所あたり目安 5,000円〜30,000円程度（範囲や照射回数により異なります）",
    budgetTier: "petit",
    downtimeText: "照射部位に数日〜1週間程度、保護テープが必要になる場合があります。",
    cautionNote: "肌質によって跡が残る場合や、一時的に色素沈着が目立つ場合があります。事前カウンセリングで肌質に合うか確認してください。",
  },
  {
    id: "skin-chemical-peel",
    category: "skinTreatment",
    name: "ケミカルピーリング",
    overview: "肌表面の古い角質に薬剤を作用させ、肌をなめらかに整えることを目的とした施術です。",
    costRangeText: "1回あたり目安 5,000円〜15,000円程度",
    budgetTier: "petit",
    downtimeText: "施術当日〜数日、赤みや乾燥を感じることがあります。",
    cautionNote: "肌の状態によっては刺激を感じる場合があります。頻度や薬剤の強さは医師に相談してください。",
  },
  {
    id: "hair-removal-medical",
    category: "hairRemoval",
    name: "医療脱毛（部分）",
    overview: "医療レーザーで毛根にアプローチする脱毛を目的とした施術です。複数回の通院が一般的です。",
    costRangeText: "部位・回数により目安 10,000円〜100,000円程度",
    budgetTier: "standard",
    downtimeText: "施術当日〜数日、赤みやヒリヒリ感が出ることがあります。",
    cautionNote: "効果や必要な回数には個人差があります。日焼け後は施術を断られる場合があるため、事前に確認してください。",
  },
  {
    id: "botox-expression-lines",
    category: "botox",
    name: "ボトックス注射（表情じわ）",
    overview: "眉間や額などに注射し、表情じわの動きを一時的に抑えることを目的とした施術です。",
    costRangeText: "1回あたり目安 20,000円〜60,000円程度",
    budgetTier: "standard",
    downtimeText: "注射部位に当日〜数日、内出血や軽いむくみが出ることがあります。",
    cautionNote: "効果は3〜6ヶ月程度で徐々に薄れるとされ、継続的な施術が必要です。妊娠中・持病がある場合は医師に必ず相談してください。",
  },
];
