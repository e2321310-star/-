import type { BrandProduct } from "@/lib/types";

// 成分×ブランド商品の初期データ。悩み(concern)×カテゴリごとに代表的な市販品を1件ずつ登録。
// 商品ラインナップは変わるため、あくまで一例。/products 画面から自由に追加・編集できる。
export const SEED_PRODUCTS: BrandProduct[] = [
  // 毛穴
  { concern: "pores", category: "lotion", ingredient: "収れん成分", brand: "石澤研究所", name: "毛穴撫子 お米の化粧水" },
  { concern: "pores", category: "serum", ingredient: "ナイアシンアミド", brand: "肌ラボ", name: "極潤ハトムギ美容液" },
  { concern: "pores", category: "cream", ingredient: "スクワラン", brand: "ニベア", name: "ニベアクリーム" },
  { concern: "pores", category: "emulsion", ingredient: "セラミド機能成分", brand: "キュレル", name: "皮脂トラブルケア乳液" },
  { concern: "pores", category: "pack", ingredient: "クレイ(カオリン等)", brand: "クリアターン", name: "毛穴パック マスク" },

  // 色ムラ・美白
  { concern: "brightening", category: "lotion", ingredient: "ビタミンC誘導体", brand: "ロート製薬", name: "メラノCC 薬用しみ対策 美白化粧水" },
  { concern: "brightening", category: "serum", ingredient: "ビタミンC誘導体", brand: "ロート製薬", name: "メラノCC 薬用しみ対策 美白美容液" },
  { concern: "brightening", category: "cream", ingredient: "トラネキサム酸", brand: "常盤薬品", name: "なめらか本舗 豆乳イソフラボン 美白クリーム" },
  { concern: "brightening", category: "emulsion", ingredient: "アルブチン", brand: "常盤薬品", name: "なめらか本舗 豆乳イソフラボン 美白乳液" },
  { concern: "brightening", category: "pack", ingredient: "ビタミンC誘導体", brand: "BCL", name: "サボリーノ 目ざまシート 明るい肌へ" },

  // 乾燥
  { concern: "dryness", category: "lotion", ingredient: "ヒアルロン酸", brand: "ロート製薬", name: "肌ラボ 極潤 ヒアルロン液" },
  { concern: "dryness", category: "serum", ingredient: "セラミド", brand: "ちふれ", name: "濃厚保湿美容液" },
  { concern: "dryness", category: "cream", ingredient: "セラミド機能成分", brand: "キュレル", name: "潤浸保湿クリーム" },
  { concern: "dryness", category: "emulsion", ingredient: "グリセリン", brand: "イミュ", name: "ハトムギ乳液" },
  { concern: "dryness", category: "pack", ingredient: "ヒアルロン酸", brand: "Mediheal", name: "N.M.F アクアリングマスク" },

  // テカリ・皮脂
  { concern: "oiliness", category: "lotion", ingredient: "ハトムギエキス", brand: "イミュ", name: "薬用ハトムギ化粧水" },
  { concern: "oiliness", category: "serum", ingredient: "ナイアシンアミド", brand: "オルビス", name: "クリア 薬用美容液" },
  { concern: "oiliness", category: "cream", ingredient: "皮脂吸着パウダー", brand: "オルビス", name: "クリア ジェルクリーム" },
  { concern: "oiliness", category: "emulsion", ingredient: "皮脂吸着成分", brand: "無印良品", name: "皮脂テカリ防止乳液" },
  { concern: "oiliness", category: "pack", ingredient: "クレイ(カオリン等)", brand: "クリアターン", name: "米ぬかの力 マスク" },

  // ハリ・エイジング
  { concern: "firmness", category: "lotion", ingredient: "アルジルリン", brand: "花王", name: "ソフィーナ iP ベースケア化粧水 とてもしっとり" },
  { concern: "firmness", category: "serum", ingredient: "レチノール", brand: "花王", name: "ソフィーナ iP エイジングケア美容液" },
  { concern: "firmness", category: "cream", ingredient: "ペプチド", brand: "POLA", name: "B.A クリーム" },
  { concern: "firmness", category: "emulsion", ingredient: "コラーゲン", brand: "資生堂", name: "エリクシール リフトモイスト乳液" },
  { concern: "firmness", category: "pack", ingredient: "ピテラ", brand: "SK-II", name: "フェイシャルトリートメントマスク" },

  // 肌荒れ・鎮静
  { concern: "soothing", category: "lotion", ingredient: "セラミド機能成分", brand: "キュレル", name: "潤浸保湿 化粧水" },
  { concern: "soothing", category: "serum", ingredient: "アラントイン", brand: "無印良品", name: "エイジングケア美容液(敏感肌用)" },
  { concern: "soothing", category: "cream", ingredient: "アベンヌ温泉水", brand: "アベンヌ", name: "ウォーター配合クリーム" },
  { concern: "soothing", category: "emulsion", ingredient: "ユーカリエキス", brand: "キュレル", name: "皮脂トラブルケア乳液(敏感肌用)" },
  { concern: "soothing", category: "pack", ingredient: "パンテノール", brand: "ドクターメディオン", name: "パンテノール配合シートマスク" },
];
