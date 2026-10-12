import type { BrandProduct } from "@/lib/types";

// 成分×ブランド商品の初期データ。悩み(concern)×カテゴリごとに代表的な市販品を1件ずつ登録。
// 価格・購入リンクは実際にWeb検索で確認できたものだけ入れており、確認が取れなかった
// ものは空欄のままにしている（価格・在庫は変動するため、購入前に必ずリンク先で確認してください）。
// 一部、検索時点で確認できた実在の現行商品名に差し替えたものがある（例: パッケージ変更・改廃）。
export const SEED_PRODUCTS: BrandProduct[] = [
  {
    concern: "pores",
    category: "lotion", period: "am",
    ingredient: "収れん成分",
    brand: "石澤研究所",
    name: "毛穴撫子 お米の化粧水",
    priceRange: "budget",
    price: "1,760円",
    link: "https://www.ishizawa-lab.co.jp/keana_skincare/lotion.html",
  },

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

  {
    concern: "pores",
    category: "cream", period: "am",
    ingredient: "スクワラン",
    brand: "ニベア",
    name: "ニベアクリーム",
    priceRange: "budget",
    price: "618円",
    link: "https://www.amazon.co.jp/dp/B0CJF6894N",
  },

  { concern: "pores", category: "emulsion", period: "am", ingredient: "セラミド機能成分", brand: "キュレル", name: "皮脂トラブルケア乳液", priceRange: "mid" },

  {
    concern: "pores",
    category: "cleansing",
    ingredient: "オリーブバージンオイル",
    brand: "DHC",
    name: "薬用ディープクレンジングオイル",
    priceRange: "budget",
    price: "2,470円",
    link: "https://www.dhc.co.jp/goods/300.html",
  },

  { concern: "pores", category: "faceWash", period: "am", ingredient: "海泥(マリンシルト)", brand: "ロゼット", name: "洗顔パスタ 海泥スムース", priceRange: "budget" },

  { concern: "pores", category: "faceOil", ingredient: "スクワラン", brand: "無印良品", name: "スクワランオイル", priceRange: "budget" },

  {
    concern: "pores",
    category: "rinseOffPack",
    ingredient: "お米由来保湿成分",
    brand: "石澤研究所",
    name: "毛穴撫子 お米のパック",
    priceRange: "budget",
    price: "1,375円",
  },

  {
    concern: "pores",
    category: "needleShot",
    ingredient: "天然マイクロニードル(ヒアルロン酸)",
    brand: "VT",
    name: "リードルショット300",
    priceRange: "mid",
    region: "kr",
    note: "韓国発の針美容液。毛穴・テクスチャー対策として毎日使えるタイプ。",
  },

  { concern: "pores", category: "cleansing", ingredient: "ホットケーキフラワーコンプレックス", brand: "Banila Co", name: "クリーン イット ゼロ クレンジングバーム オリジナル", priceRange: "mid", region: "kr" },

  { concern: "pores", category: "faceWash", period: "pm", ingredient: "サリチル酸(BHA)", brand: "COSRX", name: "サリチル酸デイリージェントルクレンザー", priceRange: "budget", region: "kr" },

  { concern: "pores", category: "lotion", period: "pm", ingredient: "ドクダミエキス", brand: "Round Lab", name: "1025 独島(ドクド)トナー", priceRange: "budget", region: "kr" },

  { concern: "pores", category: "serum", ingredient: "サリチル酸(BHA)", brand: "COSRX", name: "BHA ブラックヘッド パワー リキッド", priceRange: "budget", region: "kr" },

  { concern: "pores", category: "emulsion", period: "pm", ingredient: "ヒアルロン酸", brand: "Laneige", name: "ウォーターバンク ブルー ヒアルロニック エマルジョン", priceRange: "mid", region: "kr" },

  { concern: "pores", category: "cream", period: "pm", ingredient: "サーモスポンジン", brand: "La Roche-Posay", name: "エファクラ マット", priceRange: "mid", region: "west" },

  { concern: "pores", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "Beauty of Joseon", name: "リリーフサン：ライス+プロバイオティクス", period: "am", priceRange: "budget", region: "kr", note: "SNSで話題になった韓国の人気日焼け止め。皮脂崩れしにくい軽いテクスチャー。" },

  {
    concern: "brightening",
    category: "lotion", period: "am",
    ingredient: "ビタミンC誘導体",
    brand: "ロート製薬",
    name: "メラノCC 薬用しみ対策 美白化粧水",
    priceRange: "budget",
    price: "990円",
    link: "https://jp.rohto.com/melanocc/lotion/",
  },

  {
    concern: "brightening",
    category: "serum",
    ingredient: "ビタミンC誘導体",
    brand: "ロート製薬",
    name: "メラノCC 薬用しみ対策 美白美容液",
    period: "am",
    priceRange: "budget",
    link: "https://jp.rohto.com/melanocc/premium-essence/",
    note: "ビタミンC誘導体は日中の紫外線ダメージ対策としても使いやすい。",
  },

  { concern: "brightening", category: "cream", period: "am", ingredient: "トラネキサム酸", brand: "常盤薬品", name: "なめらか本舗 豆乳イソフラボン 美白クリーム", priceRange: "budget" },

  { concern: "brightening", category: "emulsion", period: "am", ingredient: "アルブチン", brand: "常盤薬品", name: "なめらか本舗 豆乳イソフラボン 美白乳液", priceRange: "budget" },

  {
    concern: "brightening",
    category: "cleansing",
    ingredient: "ビタミンC誘導体",
    brand: "アテニア",
    name: "スキンクリア クレンズ オイル",
    priceRange: "mid",
    price: "2,200円",
    link: "https://www.attenir.co.jp/special/cleanse/index.html",
  },

  { concern: "brightening", category: "faceWash", period: "am", ingredient: "トラネキサム酸", brand: "肌ラボ", name: "白潤 薬用泡洗顔料", priceRange: "budget" },

  { concern: "brightening", category: "faceOil", ingredient: "スクワラン", brand: "ちふれ", name: "美容オイル", priceRange: "budget" },

  { concern: "brightening", category: "rinseOffPack", ingredient: "整肌保湿成分", brand: "ちふれ", name: "ピール オフ パック", priceRange: "budget", price: "506円" },

  {
    concern: "brightening",
    category: "cleansing",
    ingredient: "ガラクトミセス発酵ろ液",
    brand: "ma:nyo(魔女工場)",
    name: "ピュア クレンジングオイル",
    priceRange: "budget",
    price: "2,530円",
    region: "kr",
    note: "発酵・自然由来成分にこだわるクリーンビューティーブランド。",
  },

  {
    concern: "brightening",
    category: "needleShot",
    ingredient: "天然マイクロニードル(ナイアシンアミド)",
    brand: "VT",
    name: "リードルショット100",
    priceRange: "mid",
    price: "2,390円",
    link: "https://item.rakuten.co.jp/vtcosmetic-official/c/0000000414/",
    region: "kr",
    note: "リードルショットシリーズの中で最も刺激が少なく、毎日使いやすいタイプ。",
  },

  { concern: "brightening", category: "cleansing", ingredient: "ツバキ油", brand: "Then I Met You", name: "リビング クレンジングバーム", priceRange: "premium", region: "kr" },

  { concern: "brightening", category: "faceWash", period: "pm", ingredient: "ドクダミエキス", brand: "Round Lab", name: "1025 独島(ドクド)クレンザー", priceRange: "budget", region: "kr" },

  { concern: "brightening", category: "lotion", period: "pm", ingredient: "米ぬかエキス/ナイアシンアミド", brand: "Beauty of Joseon", name: "レディアンス フェイシャルトナー", priceRange: "budget", region: "kr" },

  { concern: "brightening", category: "serum", ingredient: "アルブチン/ナイアシンアミド", brand: "Beauty of Joseon", name: "グロウ ディープセラム：ライス+アルブチン", period: "pm", priceRange: "budget", region: "kr", note: "SNSで火付け役となった韓国の人気美容液。夜のスペシャルケアとして。" },

  { concern: "brightening", category: "emulsion", period: "pm", ingredient: "コラーゲン", brand: "Etude House", name: "モイストフル コラーゲン エマルジョン", priceRange: "budget", region: "kr" },

  { concern: "brightening", category: "cream", period: "pm", ingredient: "ビタミンC誘導体", brand: "CLINIQUE", name: "イーブンベター クリニカル ダークスポットコレクター", priceRange: "premium", region: "west" },

  {
    concern: "dryness",
    category: "lotion",
    ingredient: "ヒアルロン酸",
    brand: "ロート製薬",
    name: "肌ラボ 極潤 ヒアルロン液",
    priceRange: "budget",
    price: "902円",
    link: "https://www.shop.rohto.co.jp/category/skincare/hadalabo/gokujyun/155712.html",
  },

  {
    concern: "dryness",
    category: "serum",
    ingredient: "セラミド",
    brand: "ちふれ",
    name: "集中保湿美容液",
    period: "pm",
    priceRange: "budget",
    price: "880円",
    link: "https://www.amazon.co.jp/dp/B0B5G4P14K",
  },

  {
    concern: "dryness",
    category: "cream", period: "am",
    ingredient: "セラミド機能成分",
    brand: "キュレル",
    name: "潤浸保湿クリーム",
    priceRange: "mid",
    price: "2,970円",
    link: "https://www.kao-kirei.com/ja/item/kbb/curel/4901301236210/",
  },

  {
    concern: "dryness",
    category: "emulsion", period: "am",
    ingredient: "グリセリン",
    brand: "ナチュリエ",
    name: "ハトムギ浸透乳液",
    priceRange: "budget",
    price: "825円",
    link: "https://www.imju.jp/shop/g/g4903335696855/",
  },

  { concern: "dryness", category: "cleansing", ingredient: "オリーブスクワラン", brand: "無印良品", name: "クレンジングオイル", priceRange: "budget" },

  { concern: "dryness", category: "faceWash", period: "am", ingredient: "セラミド機能成分", brand: "キュレル", name: "潤浸保湿 泡洗顔料", priceRange: "mid" },

  {
    concern: "dryness",
    category: "faceOil",
    ingredient: "ラベンダー油",
    brand: "キールズ",
    name: "ミッドナイトボタニカル コンセントレート",
    priceRange: "premium",
    price: "7,150円",
    link: "https://www.kiehls.jp/skincare/face-product/face-serums/kiehls-midnight-recovery-concentrate/819.html",
  },

  {
    concern: "dryness",
    category: "rinseOffPack",
    ingredient: "大豆イソフラボン",
    brand: "常盤薬品",
    name: "なめらか本舗 もちもち濃パック",
    priceRange: "budget",
    price: "1,320円",
  },

  {
    concern: "dryness",
    category: "needleShot",
    ingredient: "天然マイクロニードル(セラミドNP)",
    brand: "VT",
    name: "リードルショット700",
    priceRange: "mid",
    region: "kr",
    note: "セラミドNPなど保湿成分を追加配合。週1回程度の集中ケア向け。",
  },

  {
    concern: "dryness",
    category: "cleansing",
    ingredient: "ビタミンE",
    brand: "CLINIQUE",
    name: "テイク ザ デイ オフ クレンジングバーム",
    priceRange: "premium",
    price: "4,400円",
    link: "https://www.clinique.jp/product/1673/6424/take-the-day-off",
    region: "west",
  },

  { concern: "dryness", category: "faceWash", period: "pm", ingredient: "セラミド/ヒアルロン酸", brand: "CeraVe", name: "ハイドレイティング フェイシャル クレンザー", priceRange: "budget", region: "west" },

  { concern: "dryness", category: "lotion", ingredient: "ヒアルロン酸", brand: "Laneige", name: "ウォーターバンク ブルー ヒアルロニック トナー", priceRange: "mid", region: "kr" },

  { concern: "dryness", category: "serum", ingredient: "ヒアルロン酸", brand: "THE ORDINARY", name: "ハイアルロニック アシッド 2% + B5", period: "am", priceRange: "budget", region: "west" },

  { concern: "dryness", category: "emulsion", period: "pm", ingredient: "セラミド", brand: "Illiyoon", name: "セラマイド アト ローション", priceRange: "budget", region: "kr" },

  {
    concern: "dryness",
    category: "rinseOffPack",
    ingredient: "ヒアルロン酸",
    brand: "Laneige",
    name: "ウォーター スリーピングマスク",
    priceRange: "mid",
    region: "kr",
    note: "一晩おいた翌朝のもちもち肌で有名な、Laneigeの代表的な集中保湿マスク。",
  },

  {
    concern: "dryness",
    category: "cream", period: "pm",
    ingredient: "セラミド",
    brand: "AESTURA",
    name: "アトバリア365 クリーム",
    priceRange: "mid",
    price: "3,300円",
    region: "kr",
    note: "敏感肌・乾燥肌向けの皮膚科学系ブランド。アモーレパシフィックグループ。",
  },

  {
    concern: "dryness",
    category: "serum",
    ingredient: "低分子ヒアルロン酸",
    brand: "Torriden",
    name: "ダイブイン セラム",
    priceRange: "budget",
    price: "2,420円",
    region: "kr",
    note: "保湿特化のクリーンビューティーブランド。弱酸性・低刺激処方。",
  },

  {
    concern: "oiliness",
    category: "lotion", period: "am",
    ingredient: "ハトムギエキス",
    brand: "ナチュリエ",
    name: "薬用ハトムギ化粧水",
    priceRange: "budget",
    price: "748円",
    link: "https://www.imju.jp/shop/g/g4903335693601/",
  },

  { concern: "oiliness", category: "serum", ingredient: "ナイアシンアミド", brand: "オルビス", name: "クリア 薬用美容液", period: "am", priceRange: "mid" },

  { concern: "oiliness", category: "cream", period: "am", ingredient: "皮脂吸着パウダー", brand: "オルビス", name: "クリア ジェルクリーム", priceRange: "mid" },

  { concern: "oiliness", category: "emulsion", period: "am", ingredient: "皮脂吸着成分", brand: "無印良品", name: "皮脂テカリ防止乳液", priceRange: "budget" },

  {
    concern: "oiliness",
    category: "cleansing",
    ingredient: "ホホバオイル",
    brand: "Anua(アヌア)",
    name: "ドクダミポアコントロール クレンジングオイル",
    priceRange: "mid",
    price: "2,450円",
    link: "https://anuashop.jp/products/sior0005",
  },

  {
    concern: "oiliness",
    category: "faceWash", period: "am",
    ingredient: "ナイアシンアミド",
    brand: "オルビス",
    name: "クリアフル ウォッシュ",
    priceRange: "mid",
    price: "1,430円",
    link: "https://www.orbis.co.jp/small/11011101/",
  },

  { concern: "oiliness", category: "faceOil", ingredient: "ホホバオイル", brand: "生活の木", name: "ホホバオイル(浸透型)", priceRange: "budget", note: "オイルでも軽いテクスチャーのものを薄く使うと、乾燥によるベタつき悪化を防げる。" },

  {
    concern: "oiliness",
    category: "rinseOffPack",
    ingredient: "火山灰(ソンイ)",
    brand: "innisfree",
    name: "ヴォルカニック ポア クレイ マスク",
    priceRange: "budget",
    price: "1,760円",
  },

  {
    concern: "oiliness",
    category: "needleShot",
    ingredient: "ハイドロコロイド",
    brand: "COSRX",
    name: "アクネ ピンプル マスターパッチ",
    priceRange: "budget",
    price: "548円",
    link: "https://www.cosrx.com/products/acne-pimple-master-patch",
    region: "kr",
    note: "ニードルタイプではないが、気になる吹き出物にピンポイントで貼る定番の集中ケアパッチ。",
  },

  { concern: "oiliness", category: "cleansing", ingredient: "グリーンティーエキス", brand: "innisfree", name: "グリーンティー クレンジングオイル", priceRange: "budget", region: "kr" },

  { concern: "oiliness", category: "faceWash", period: "pm", ingredient: "ナイアシンアミド", brand: "CeraVe", name: "フォーミング フェイシャル クレンザー", priceRange: "budget", region: "west" },

  { concern: "oiliness", category: "lotion", period: "pm", ingredient: "緑茶エキス", brand: "Isntree", name: "グリーンティー フレッシュトナー", priceRange: "budget", region: "kr" },

  { concern: "oiliness", category: "serum", ingredient: "ナイアシンアミド", brand: "THE ORDINARY", name: "ナイアシンアミド 10% + ジンク 1%", period: "pm", priceRange: "budget", region: "west" },

  { concern: "oiliness", category: "emulsion", period: "pm", ingredient: "ナイアシンアミド", brand: "CeraVe", name: "PM フェイシャル モイスチャライジングローション", priceRange: "budget", region: "west" },

  { concern: "oiliness", category: "cream", period: "pm", ingredient: "ハーブエキス", brand: "belif", name: "アクアボム", priceRange: "mid", region: "kr" },

  {
    concern: "oiliness",
    category: "sunscreen",
    ingredient: "紫外線吸収剤/散乱剤",
    brand: "La Roche-Posay",
    name: "アンテリオス UVマイルド ウルトラライトフルイド",
    period: "am",
    priceRange: "mid",
    region: "west",
  },

  {
    concern: "oiliness",
    category: "cream",
    ingredient: "低分子ヒアルロン酸",
    brand: "Torriden",
    name: "ダイブイン クリーム",
    priceRange: "budget",
    price: "2,310円",
    region: "kr",
    note: "ベタつかないジェルタイプで、オイリー肌でも使いやすい保湿クリーム。",
  },

  {
    concern: "firmness",
    category: "lotion", period: "am",
    ingredient: "アルジルリン",
    brand: "花王",
    name: "ソフィーナ iP ベースケア化粧水 とてもしっとり",
    priceRange: "mid",
    link: "https://www.kao-kirei.com/ja/official/sofina-ip/products/treatmentlotion/",
  },

  {
    concern: "firmness",
    category: "serum",
    ingredient: "レチノール",
    brand: "花王",
    name: "ソフィーナ iP 薬用シワ改善 泡セラム",
    period: "pm",
    priceRange: "mid",
    price: "5,800円",
    link: "https://www.kao-kirei.com/ja/official/sofina-ip/products/",
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
    link: "https://h-jp.fujifilm.com/products/astalift/jelly/100202000001.html",
    note: "日中でも使いやすいエイジングケア美容液。",
  },

  {
    concern: "firmness",
    category: "cream", period: "am",
    ingredient: "ペプチド",
    brand: "POLA",
    name: "B.A クリーム",
    priceRange: "premium",
    price: "38,500円",
    link: "https://www.pola.co.jp/ec/products/g-1239/",
  },

  {
    concern: "firmness",
    category: "emulsion",
    ingredient: "コラーゲン",
    brand: "資生堂",
    name: "エリクシール リフトモイスト乳液",
    priceRange: "mid",
    price: "3,410円",
    link: "https://www.shiseido.co.jp/sw/onlinestore/products/H75102.html",
  },

  {
    concern: "firmness",
    category: "cleansing",
    ingredient: "ピテラ",
    brand: "SK-II",
    name: "フェイシャル トリートメント クレンザー",
    priceRange: "premium",
    price: "6,540円",
  },

  { concern: "firmness", category: "faceWash", period: "am", ingredient: "酵素", brand: "POLA", name: "B.A ウォッシュ 7", priceRange: "premium", price: "12,100円" },

  { concern: "firmness", category: "faceOil", ingredient: "オリーブバージンオイル", brand: "DHC", name: "オリーブバージンオイル", priceRange: "mid" },

  { concern: "firmness", category: "rinseOffPack", ingredient: "デッドシーミネラル", brand: "SABON", name: "ニューリッシング バイオ クレイ マスク", priceRange: "mid" },

  {
    concern: "firmness",
    category: "needleShot",
    ingredient: "天然マイクロニードル(高麗人参根エキス)",
    brand: "VT",
    name: "リードルショット1000",
    priceRange: "mid",
    region: "kr",
    note: "高麗人参根エキスや水溶性プロテオグリカンを追加配合した上位ライン。週1回目安。",
  },

  { concern: "firmness", category: "cleansing", ingredient: "米ぬかエキス", brand: "Tatcha", name: "ザ ライスウォッシュ", priceRange: "premium", region: "west" },

  { concern: "firmness", category: "faceWash", period: "pm", ingredient: "マルラオイル", brand: "Drunk Elephant", name: "ベステ No.9 ジェリークレンザー", priceRange: "premium", region: "west" },

  { concern: "firmness", category: "lotion", period: "pm", ingredient: "アダノシン", brand: "Laneige", name: "パーフェクト リニュー トナー", priceRange: "mid", region: "kr" },

  { concern: "firmness", category: "serum", ingredient: "ジャソエキス", brand: "雪花秀(Sulwhasoo)", name: "ファーストケア アクティベイティング セラム", priceRange: "premium", region: "kr", note: "韓国の高級ブランドを代表する導入美容液。" },

  { concern: "firmness", category: "faceOil", ingredient: "マルラオイル", brand: "Drunk Elephant", name: "マルラ ラグジュアリー フェイシャルオイル", priceRange: "premium", region: "west" },

  { concern: "firmness", category: "cream", period: "pm", ingredient: "高麗人参エキス", brand: "Beauty of Joseon", name: "ダイナスティクリーム", priceRange: "mid", region: "kr" },

  { concern: "firmness", category: "rinseOffPack", ingredient: "ゴールド", brand: "Peter Thomas Roth", name: "24K ゴールド マスク", priceRange: "premium", region: "west" },

  {
    concern: "firmness",
    category: "cream",
    ingredient: "発酵保湿成分",
    brand: "su:m37°",
    name: "ウォーターフル タイムレス ウォータージェルクリーム",
    priceRange: "premium",
    price: "7,480円",
    region: "kr",
  },

  {
    concern: "firmness",
    category: "serum",
    ingredient: "ビフィズス菌発酵エキス",
    brand: "ma:nyo(魔女工場)",
    name: "ビフィダ バイオーム コンプレックス アンプル",
    priceRange: "mid",
    price: "3,480円",
    region: "kr",
  },

  {
    concern: "soothing",
    category: "lotion", period: "am",
    ingredient: "セラミド機能成分",
    brand: "キュレル",
    name: "潤浸保湿 化粧水",
    priceRange: "mid",
    price: "2,090円",
    link: "https://www.kao-kirei.com/ja/item/kbb/curel/4901301236197/",
  },

  {
    concern: "soothing",
    category: "serum",
    ingredient: "アラントイン",
    brand: "無印良品",
    name: "エイジングケア美容液(敏感肌用)",
    period: "am",
    priceRange: "budget",
    price: "1,490円",
    link: "https://www.muji.com/jp/ja/store/cmdty/detail/4550583924461",
  },

  {
    concern: "soothing",
    category: "cream", period: "am",
    ingredient: "アベンヌ温泉水",
    brand: "アベンヌ",
    name: "コールドクリームN",
    priceRange: "mid",
    price: "1,650円",
    link: "https://www.avene.co.jp/products/bpc/08/",
  },

  { concern: "soothing", category: "emulsion", period: "am", ingredient: "ユーカリエキス", brand: "キュレル", name: "皮脂トラブルケア乳液(敏感肌用)", priceRange: "mid" },

  { concern: "soothing", category: "cleansing", ingredient: "セラミド機能成分", brand: "キュレル", name: "潤浸保湿 メイク落としジェル", priceRange: "mid" },

  {
    concern: "soothing",
    category: "faceWash", period: "am",
    ingredient: "グリセリン",
    brand: "セタフィル",
    name: "ジェントルスキンクレンザー",
    priceRange: "mid",
    price: "3,300円",
    link: "https://www.cetaphil.jp/gentleskincleanser/3499320012644A.html",
  },

  { concern: "soothing", category: "faceOil", ingredient: "カレンデュラ油", brand: "NALs(ナルス)", name: "カレンデュラオイル", priceRange: "mid" },

  {
    concern: "soothing",
    category: "rinseOffPack",
    ingredient: "アベンヌ温泉水",
    brand: "アベンヌ",
    name: "イドランス スリーピングマスク",
    priceRange: "mid",
    price: "3,850円",
  },

  {
    concern: "soothing",
    category: "needleShot",
    ingredient: "CICAエクソソーム",
    brand: "VT",
    name: "リードルショット1300",
    priceRange: "mid",
    region: "kr",
    note: "CICAエクソソームやEGF、ペプチドコンプレックスを配合した最上位ライン。刺激も強めなので様子を見ながら。",
  },

  { concern: "soothing", category: "cleansing", ingredient: "グリセリン", brand: "La Roche-Posay", name: "トレリアン ダーモクレンザー", priceRange: "mid", region: "west" },

  { concern: "soothing", category: "faceWash", period: "pm", ingredient: "アラントイン", brand: "Pyunkang Yul", name: "ロウpH ピュアクレンジングフォーム", priceRange: "budget", region: "kr" },

  { concern: "soothing", category: "lotion", period: "pm", ingredient: "ドクダミエキス", brand: "Pyunkang Yul", name: "エッセンストナー", priceRange: "budget", region: "kr", note: "成分数を絞ったミニマル処方で敏感肌にも人気の定番トナー。" },

  { concern: "soothing", category: "serum", ingredient: "ツボクサエキス(CICA)", brand: "Dr.Jart+", name: "シカペア タイガーグラスセラム", period: "pm", priceRange: "mid", region: "kr" },

  { concern: "soothing", category: "emulsion", period: "pm", ingredient: "ドクダミエキス", brand: "Pyunkang Yul", name: "モイスチャーエマルジョン", priceRange: "budget", region: "kr" },

  { concern: "soothing", category: "cream", period: "pm", ingredient: "ツボクサエキス(センテラ)", brand: "SKIN1004", name: "マダガスカル センテラ クリーム", priceRange: "budget", region: "kr" },

  {
    concern: "soothing",
    category: "serum",
    ingredient: "プロポリスエキス",
    brand: "CNP Laboratory",
    name: "プロポリス エネルギー アンプル",
    priceRange: "mid",
    price: "3,080円",
    region: "kr",
    note: "皮膚科学をベースにしたLG生活健康グループのブランド。",
  },

  { concern: "pores", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "花王", name: "ビオレUV アクアリッチ ウォータリーエッセンス", period: "am", priceRange: "budget" },

  {
    concern: "brightening",
    category: "sunscreen",
    ingredient: "紫外線吸収剤/散乱剤",
    brand: "資生堂",
    name: "アネッサ パーフェクトUV スキンケアミルク",
    period: "am",
    priceRange: "mid",
    price: "3,058円",
    link: "https://www.shiseido.co.jp/sw/onlinestore/products/H16501.html",
  },

  {
    concern: "dryness",
    category: "sunscreen",
    ingredient: "紫外線吸収剤/散乱剤",
    brand: "花王",
    name: "キュレル UVエッセンス",
    period: "am",
    priceRange: "mid",
    price: "2,400円",
    link: "https://www.kao-kirei.com/ja/item/kbb/curel/4901301413505/",
  },

  { concern: "oiliness", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "花王", name: "ビオレUV あせラクさらさら游 UVジェル", period: "am", priceRange: "budget" },

  { concern: "firmness", category: "sunscreen", ingredient: "紫外線吸収剤/散乱剤", brand: "資生堂", name: "エリクシール UVクリアミルク", period: "am", priceRange: "mid" },

  {
    concern: "soothing",
    category: "sunscreen",
    ingredient: "紫外線吸収剤/散乱剤",
    brand: "ノブ",
    name: "UVシールドEX（敏感肌用）",
    period: "am",
    priceRange: "mid",
    price: "2,750円",
    link: "https://item.rakuten.co.jp/arianakosume/4934651579010-1/",
  },
];
