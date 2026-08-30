import type { BrandProduct } from "@/lib/types";

// 成分×ブランド商品の初期データ。悩み(concern)×カテゴリごとに代表的な市販品を1件ずつ登録。
// 商品ラインナップ・実売価格は変わるため、価格は「プチプラ/ミドル/デパコス」の目安のみ。
// 具体的な価格・購入リンクはご自身で確認のうえ、/products 画面から入力してください。
export const SEED_PRODUCTS: BrandProduct[] = [
  // 毛穴
  { concern: "pores", category: "lotion", ingredient: "収れん成分", brand: "石澤研究所", name: "毛穴撫子 お米の化粧水", priceRange: "budget" },
  {
    concern: "pores",
    category: "serum",
    ingredient: "ナイアシンアミド",
    brand: "肌ラボ",
    name: "極潤ハトムギ美容液",
    period: "am",
    priceRange: "budget",
    note: "刺激が少なく、日中の毛穴・皮脂対策に。",
  },
  {
    concern: "pores",
    category: "serum",
    ingredient: "サリチル酸(BHA)",
    brand: "ロゼット",
    name: "ロゼット サリチル酸配合薬用美容液",
    period: "pm",
    priceRange: "budget",
    note: "角質・毛穴詰まりへの働きが期待できる反面、日中は紫外線刺激を受けやすくなるため夜のケア向き。",
  },
  { concern: "pores", category: "cream", ingredient: "スクワラン", brand: "ニベア", name: "ニベアクリーム", priceRange: "budget" },
  { concern: "pores", category: "emulsion", ingredient: "セラミド機能成分", brand: "キュレル", name: "皮脂トラブルケア乳液", priceRange: "mid" },
  { concern: "pores", category: "pack", ingredient: "クレイ(カオリン等)", brand: "クリアターン", name: "毛穴パック マスク", priceRange: "budget" },

  // 色ムラ・美白
  { concern: "brightening", category: "lotion", ingredient: "ビタミンC誘導体", brand: "ロート製薬", name: "メラノCC 薬用しみ対策 美白化粧水", priceRange: "budget" },
  { concern: "brightening", category: "serum", ingredient: "ビタミンC誘導体", brand: "ロート製薬", name: "メラノCC 薬用しみ対策 美白美容液", priceRange: "budget" },
  { concern: "brightening", category: "cream", ingredient: "トラネキサム酸", brand: "常盤薬品", name: "なめらか本舗 豆乳イソフラボン 美白クリーム", priceRange: "budget" },
  { concern: "brightening", category: "emulsion", ingredient: "アルブチン", brand: "常盤薬品", name: "なめらか本舗 豆乳イソフラボン 美白乳液", priceRange: "budget" },
  { concern: "brightening", category: "pack", ingredient: "ビタミンC誘導体", brand: "BCL", name: "サボリーノ 目ざまシート 明るい肌へ", priceRange: "budget" },

  // 乾燥
  { concern: "dryness", category: "lotion", ingredient: "ヒアルロン酸", brand: "ロート製薬", name: "肌ラボ 極潤 ヒアルロン液", priceRange: "budget" },
  { concern: "dryness", category: "serum", ingredient: "セラミド", brand: "ちふれ", name: "濃厚保湿美容液", priceRange: "budget" },
  { concern: "dryness", category: "cream", ingredient: "セラミド機能成分", brand: "キュレル", name: "潤浸保湿クリーム", priceRange: "mid" },
  { concern: "dryness", category: "emulsion", ingredient: "グリセリン", brand: "イミュ", name: "ハトムギ乳液", priceRange: "budget" },
  { concern: "dryness", category: "pack", ingredient: "ヒアルロン酸", brand: "Mediheal", name: "N.M.F アクアリングマスク", priceRange: "budget" },

  // テカリ・皮脂
  { concern: "oiliness", category: "lotion", ingredient: "ハトムギエキス", brand: "イミュ", name: "薬用ハトムギ化粧水", priceRange: "budget" },
  { concern: "oiliness", category: "serum", ingredient: "ナイアシンアミド", brand: "オルビス", name: "クリア 薬用美容液", priceRange: "mid" },
  { concern: "oiliness", category: "cream", ingredient: "皮脂吸着パウダー", brand: "オルビス", name: "クリア ジェルクリーム", priceRange: "mid" },
  { concern: "oiliness", category: "emulsion", ingredient: "皮脂吸着成分", brand: "無印良品", name: "皮脂テカリ防止乳液", priceRange: "budget" },
  { concern: "oiliness", category: "pack", ingredient: "クレイ(カオリン等)", brand: "クリアターン", name: "米ぬかの力 マスク", priceRange: "budget" },

  // ハリ・エイジング
  { concern: "firmness", category: "lotion", ingredient: "アルジルリン", brand: "花王", name: "ソフィーナ iP ベースケア化粧水 とてもしっとり", priceRange: "mid" },
  {
    concern: "firmness",
    category: "serum",
    ingredient: "レチノール",
    brand: "花王",
    name: "ソフィーナ iP エイジングケア美容液",
    period: "pm",
    priceRange: "mid",
    note: "レチノールは光に不安定で紫外線刺激も受けやすいため、基本的に夜のケアで使う成分。",
  },
  {
    concern: "firmness",
    category: "serum",
    ingredient: "ペプチド",
    brand: "富士フイルム",
    name: "アスタリフト ジェリー アクアリスタ",
    period: "am",
    priceRange: "premium",
    note: "日中でも使いやすいエイジングケア美容液。",
  },
  { concern: "firmness", category: "cream", ingredient: "ペプチド", brand: "POLA", name: "B.A クリーム", priceRange: "premium" },
  { concern: "firmness", category: "emulsion", ingredient: "コラーゲン", brand: "資生堂", name: "エリクシール リフトモイスト乳液", priceRange: "mid" },
  { concern: "firmness", category: "pack", ingredient: "ピテラ", brand: "SK-II", name: "フェイシャルトリートメントマスク", priceRange: "premium" },

  // 肌荒れ・鎮静
  { concern: "soothing", category: "lotion", ingredient: "セラミド機能成分", brand: "キュレル", name: "潤浸保湿 化粧水", priceRange: "mid" },
  { concern: "soothing", category: "serum", ingredient: "アラントイン", brand: "無印良品", name: "エイジングケア美容液(敏感肌用)", priceRange: "budget" },
  { concern: "soothing", category: "cream", ingredient: "アベンヌ温泉水", brand: "アベンヌ", name: "ウォーター配合クリーム", priceRange: "mid" },
  { concern: "soothing", category: "emulsion", ingredient: "ユーカリエキス", brand: "キュレル", name: "皮脂トラブルケア乳液(敏感肌用)", priceRange: "mid" },
  { concern: "soothing", category: "pack", ingredient: "パンテノール", brand: "ドクターメディオン", name: "パンテノール配合シートマスク", priceRange: "mid" },

  // 日焼け止め（朝の仕上げに。紫外線は色ムラ・乾燥・ハリ低下など多くの悩みを進行させるため悩みを問わず推奨）
  { concern: "pores", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "花王", name: "ビオレUV アクアリッチ ウォータリーエッセンス", period: "am", priceRange: "budget" },
  { concern: "brightening", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "資生堂", name: "アネッサ パーフェクトUV スキンケアミルク", period: "am", priceRange: "mid" },
  { concern: "dryness", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "花王", name: "キュレル UVエッセンス", period: "am", priceRange: "mid" },
  { concern: "oiliness", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "花王", name: "ビオレUV あせラクさらさら游 UVジェル", period: "am", priceRange: "budget" },
  { concern: "firmness", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "資生堂", name: "エリクシール UVクリアミルク", period: "am", priceRange: "mid" },
  { concern: "soothing", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "ノブ", name: "UVシールドEX（敏感肌用）", period: "am", priceRange: "mid" },
];
