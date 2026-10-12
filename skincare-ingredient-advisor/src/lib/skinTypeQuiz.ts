import type { FullSkinType, SkinTypeDiagnosis, SkinTypeQuizScores } from "./types";

// 肌タイプ診断の質問・配点。ここを直すだけで質問内容や判定の感度を調整できる。
export interface SkinQuizOption {
  label: string;
  // 各軸への加点（省略したものは0点）
  scores: Partial<SkinTypeQuizScores>;
}

export interface SkinQuizQuestion {
  id: string;
  text: string;
  options: SkinQuizOption[];
}

export const SKIN_QUIZ_QUESTIONS: SkinQuizQuestion[] = [
  {
    id: "afterWash",
    text: "洗顔後、何もつけずに10〜15分たつと肌はどうなりますか？",
    options: [
      { label: "すぐつっぱって、カサカサ・粉っぽくなる", scores: { dryness: 2 } },
      { label: "特に何も感じない、ちょうどいい", scores: {} },
      { label: "だんだんベタつき・テカリが出てくる", scores: { oiliness: 2 } },
      { label: "頬はつっぱるのに、おでこや鼻だけベタつく", scores: { dryness: 1, oiliness: 1, zoneDiff: 2 } },
    ],
  },
  {
    id: "noonShine",
    text: "昼ごろ、おでこや鼻のテカリは気になりますか？",
    options: [
      { label: "顔全体がかなりテカる", scores: { oiliness: 2 } },
      { label: "おでこ・鼻だけテカる", scores: { oiliness: 1, zoneDiff: 2 } },
      { label: "少し気になる程度", scores: { oiliness: 1 } },
      { label: "気にならない", scores: {} },
    ],
  },
  {
    id: "cheekDryness",
    text: "頬（ほっぺ）がカサついたり、粉をふいたりすることはありますか？",
    options: [
      { label: "よくある", scores: { dryness: 2 } },
      { label: "時々ある", scores: { dryness: 1 } },
      { label: "ほとんどない", scores: {} },
    ],
  },
  {
    id: "pores",
    text: "毛穴の開きや黒ずみは気になりますか？",
    options: [
      { label: "顔全体で気になる", scores: { oiliness: 1 } },
      { label: "鼻やおでこだけ気になる", scores: { oiliness: 1, zoneDiff: 1 } },
      { label: "あまり気にならない", scores: {} },
    ],
  },
  {
    id: "acne",
    text: "ニキビや吹き出物はできやすいですか？",
    options: [
      { label: "よくできる", scores: { oiliness: 2 } },
      { label: "時々できる", scores: { oiliness: 1 } },
      { label: "ほとんどできない", scores: {} },
    ],
  },
  {
    id: "newProduct",
    text: "新しい化粧品を使うと、赤み・かゆみ・ヒリヒリを感じることはありますか？",
    options: [
      { label: "よくある", scores: { sensitivity: 2 } },
      { label: "時々ある", scores: { sensitivity: 1 } },
      { label: "ほとんどない", scores: {} },
    ],
  },
  {
    id: "seasonChange",
    text: "季節の変わり目や乾燥する時期に、肌が荒れやすいですか？",
    options: [
      { label: "よく荒れる", scores: { sensitivity: 1, dryness: 1 } },
      { label: "少し荒れる", scores: { sensitivity: 1 } },
      { label: "あまり変わらない", scores: {} },
    ],
  },
  {
    id: "zoneDifference",
    text: "Tゾーン（おでこ・鼻）と頬で、肌の状態に違いはありますか？",
    options: [
      { label: "全然違う（Tゾーンはベタつくのに頬は乾燥する）", scores: { zoneDiff: 3 } },
      { label: "少し違う", scores: { zoneDiff: 1 } },
      { label: "あまり変わらない", scores: {} },
    ],
  },
  {
    id: "endOfDay",
    text: "1日の終わり、肌の状態はどちらに近いですか？",
    options: [
      { label: "乾燥してつっぱる・粉が出る", scores: { dryness: 2 } },
      { label: "全体的にベタつく・崩れる", scores: { oiliness: 2 } },
      { label: "部分によって違う（Tゾーンはベタつき、頬はカサつく）", scores: { zoneDiff: 2 } },
      { label: "特に変化を感じない", scores: {} },
    ],
  },
];

const COMBINATION_ZONE_DIFF_THRESHOLD = 3;
const SENSITIVE_THRESHOLD = 3;
const NORMAL_MAX_SCORE = 2; // 乾燥・皮脂どちらもこの点数以下なら「普通肌」寄りとみなす

export type SkinQuizResult = Omit<SkinTypeDiagnosis, "diagnosedAt">;

// 各質問への回答(選択したoptionのインデックス)から肌タイプを判定する。
// 質問数・配点を変えても、この関数自体は変更不要。
export function diagnoseSkinType(answerIndexes: number[]): SkinQuizResult {
  const scores: SkinTypeQuizScores = { dryness: 0, oiliness: 0, sensitivity: 0, zoneDiff: 0 };

  SKIN_QUIZ_QUESTIONS.forEach((question, i) => {
    const choice = question.options[answerIndexes[i]];
    if (!choice) return;
    scores.dryness += choice.scores.dryness ?? 0;
    scores.oiliness += choice.scores.oiliness ?? 0;
    scores.sensitivity += choice.scores.sensitivity ?? 0;
    scores.zoneDiff += choice.scores.zoneDiff ?? 0;
  });

  let skinType: FullSkinType;
  if (scores.zoneDiff >= COMBINATION_ZONE_DIFF_THRESHOLD) {
    // Tゾーンと頬の差が大きい場合は混合肌を優先
    skinType = "combination";
  } else if (scores.dryness <= NORMAL_MAX_SCORE && scores.oiliness <= NORMAL_MAX_SCORE) {
    skinType = "normal";
  } else if (scores.dryness > scores.oiliness) {
    skinType = "dry";
  } else {
    skinType = "oily";
  }

  const sensitive = scores.sensitivity >= SENSITIVE_THRESHOLD;

  return { skinType, sensitive, scores };
}

export const FULL_SKIN_TYPE_DESCRIPTIONS: Record<FullSkinType, string> = {
  normal:
    "水分と油分のバランスが取れていて、乾燥もベタつきも感じにくいタイプです。大きなトラブルは少ないですが、季節や年齢で傾向が変わることもあります。",
  dry: "肌の水分も油分も不足しがちで、つっぱりやカサつきを感じやすいタイプです。",
  oily: "皮脂の分泌が多く、テカリやベタつきを感じやすいタイプです。毛穴やニキビが気になりやすいこともあります。",
  combination: "Tゾーン（おでこ・鼻）と頬で肌の状態が違う、混合タイプです。部分によってケアを変えるのがポイントです。",
};

export const FULL_SKIN_TYPE_TIPS: Record<FullSkinType, string[]> = {
  normal: [
    "今の状態を保つため、保湿と紫外線対策はしっかり続けましょう",
    "スキンケアは洗顔・化粧水・乳液のシンプルな基本セットで十分です",
    "季節の変わり目は肌の変化をよく観察してみましょう",
  ],
  dry: [
    "洗顔はこすらず、ぬるま湯でやさしく洗いましょう",
    "化粧水の後はすぐに乳液・クリームでフタをするのがおすすめです",
    "洗浄力が強すぎない、保湿系の洗顔料を選んでみましょう",
  ],
  oily: [
    "洗顔は1日2回を目安に、皮脂をすっきり落としましょう",
    "さっぱりタイプの化粧水・乳液を選んでみましょう",
    "保湿を飛ばすと逆に皮脂が増えやすいので、保湿もきちんと行いましょう",
  ],
  combination: [
    "Tゾーンはさっぱり、頬はしっとり、と部分で使うアイテムを変えてもOKです",
    "顔全体に同じ量をつけるのではなく、乾燥が気になる部分に重ね付けしましょう",
    "皮脂が気になる部分だけ、洗顔やあぶらとり紙でケアするのもおすすめです",
  ],
};

export const SENSITIVE_TIP =
  "肌が揺らぎやすい（敏感肌の傾向がある）ようです。新しいアイテムを使うときは、まず目立たない部分でパッチテストをしてから使うと安心です。";
