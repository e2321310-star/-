import type { IngredientEntry } from "./types";

// 初期成分データ（悩み別）。ユーザーは /ingredients 画面から自由に追加・編集・削除できる。
export const SEED_INGREDIENTS: IngredientEntry[] = [
  // 毛穴
  {
    concern: "pores",
    name: "サリチル酸(BHA)",
    description: "毛穴の角栓・古い角質を穏やかに溶かして毛穴詰まりを防ぐ。",
  },
  {
    concern: "pores",
    name: "レチノール",
    description: "ターンオーバーを促進し、毛穴の開き・詰まりを目立ちにくくする。",
  },
  {
    concern: "pores",
    name: "ナイアシンアミド",
    description: "皮脂分泌を整え、毛穴の引き締めとバリア機能改善に働く。",
  },
  {
    concern: "pores",
    name: "クレイ(カオリン等)",
    description: "余分な皮脂・汚れを吸着し、毛穴詰まりをオフする。",
  },

  // 美白・色ムラ
  {
    concern: "brightening",
    name: "ビタミンC誘導体",
    description: "メラニン生成を抑え、色ムラ・くすみを予防して透明感を高める。",
  },
  {
    concern: "brightening",
    name: "トラネキサム酸",
    description: "炎症由来の色素沈着を抑え、美白効果が認められている有効成分。",
  },
  {
    concern: "brightening",
    name: "アルブチン",
    description: "メラニン合成酵素の働きを抑制し、シミ・色ムラを防ぐ。",
  },
  {
    concern: "brightening",
    name: "ナイアシンアミド",
    description: "メラニンの表皮への受け渡しを抑制し、透明感をサポートする。",
  },

  // 乾燥
  {
    concern: "dryness",
    name: "セラミド",
    description: "角層のバリア機能を補い、水分蒸散を防いでうるおいを保持する。",
  },
  {
    concern: "dryness",
    name: "ヒアルロン酸",
    description: "高い保水力で角層にうるおいを与える代表的な保湿成分。",
  },
  {
    concern: "dryness",
    name: "グリセリン",
    description: "水分を引き寄せて保持する基本的な保湿(humectant)成分。",
  },
  {
    concern: "dryness",
    name: "スクワラン",
    description: "皮脂に近いエモリエント成分で、うるおいを閉じ込め乾燥を防ぐ。",
  },

  // 皮脂・テカリ
  {
    concern: "oiliness",
    name: "ナイアシンアミド",
    description: "皮脂分泌のコントロールをサポートし、テカリを抑える。",
  },
  {
    concern: "oiliness",
    name: "サリチル酸(BHA)",
    description: "毛穴内の皮脂・角質にアプローチし過剰な皮脂を整える。",
  },
  {
    concern: "oiliness",
    name: "緑茶エキス",
    description: "皮脂分泌を抑える働きと抗酸化作用を併せ持つ植物由来成分。",
  },

  // ハリ・エイジング
  {
    concern: "firmness",
    name: "レチノール",
    description: "コラーゲン生成を促し、ハリ・キメを整えるエイジングケア成分。",
  },
  {
    concern: "firmness",
    name: "ペプチド",
    description: "コラーゲン・エラスチンの生成を助け、ハリ感をサポートする。",
  },
  {
    concern: "firmness",
    name: "ビタミンC誘導体",
    description: "コラーゲン合成を促進し、ハリのある肌印象へ導く。",
  },

  // 肌荒れ・鎮静
  {
    concern: "soothing",
    name: "パンテノール(プロビタミンB5)",
    description: "肌荒れを鎮め、バリア機能の回復をサポートする。",
  },
  {
    concern: "soothing",
    name: "アラントイン",
    description: "抗炎症作用があり、荒れた肌をやさしく鎮静する。",
  },
  {
    concern: "soothing",
    name: "ツボクサエキス(CICA)",
    description: "肌荒れ・赤みを鎮め、バリア機能の立て直しを助ける。",
  },
  {
    concern: "soothing",
    name: "セラミド",
    description: "バリア機能を補強し、外部刺激による肌荒れを防ぐ。",
  },
];
