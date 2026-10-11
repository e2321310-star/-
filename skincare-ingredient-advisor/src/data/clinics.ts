import type { Budget } from "@/lib/types";
import type { AestheticCategory } from "./aestheticTreatments";

export interface Clinic {
  id: string;
  name: string;
  area: string;
  specialties: AestheticCategory[];
  budgetTier: Budget;
  priceRangeText: string;
  description: string;
  addressText: string;
}

// ⚠️ ここに掲載しているクリニック情報はすべて「サンプル（仮データ）」です。実在のクリニックとの
// 提携は現時点では一切ありません。実際に送客・提携を行う際は、必ず各クリニックと契約のうえ、
// 本物の情報（名称・住所・価格・問い合わせ先）に置き換えてください。
export const CLINICS: Clinic[] = [
  {
    id: "sample-shibuya",
    name: "（サンプル）渋谷スキン&ビューティクリニック",
    area: "東京・渋谷",
    specialties: ["skinTreatment", "hairRemoval"],
    budgetTier: "standard",
    priceRangeText: "肌治療 5,000円〜／医療脱毛 10,000円〜（部位による）",
    description: "肌治療と医療脱毛を中心に扱う、初めての美容医療でも相談しやすい想定のサンプルクリニックです。",
    addressText: "東京都渋谷区（サンプル住所）",
  },
  {
    id: "sample-shinjuku",
    name: "（サンプル）新宿アイ&ノーズクリニック",
    area: "東京・新宿",
    specialties: ["doubleEyelid", "nose"],
    budgetTier: "premium",
    priceRangeText: "二重埋没法 50,000円〜／鼻ヒアルロン酸 40,000円〜",
    description: "二重・鼻などのパーツ施術を中心に扱う想定のサンプルクリニックです。",
    addressText: "東京都新宿区（サンプル住所）",
  },
  {
    id: "sample-umeda",
    name: "（サンプル）梅田トータルビューティクリニック",
    area: "大阪・梅田",
    specialties: ["botox", "skinTreatment"],
    budgetTier: "standard",
    priceRangeText: "ボトックス 20,000円〜／肌治療 5,000円〜",
    description: "ボトックスや肌治療など幅広いメニューを扱う想定のサンプルクリニックです。",
    addressText: "大阪府大阪市北区（サンプル住所）",
  },
  {
    id: "sample-nagoya",
    name: "（サンプル）名古屋駅前スキンクリニック",
    area: "愛知・名古屋",
    specialties: ["skinTreatment"],
    budgetTier: "petit",
    priceRangeText: "肌治療 5,000円〜15,000円程度",
    description: "肌治療（シミ・ピーリングなど）を中心に、比較的通いやすい価格帯を想定したサンプルクリニックです。",
    addressText: "愛知県名古屋市（サンプル住所）",
  },
  {
    id: "sample-fukuoka",
    name: "（サンプル）福岡ビューティ&レーザークリニック",
    area: "福岡・天神",
    specialties: ["hairRemoval", "skinTreatment"],
    budgetTier: "standard",
    priceRangeText: "医療脱毛 10,000円〜／肌治療 5,000円〜",
    description: "医療脱毛と肌治療を中心に扱う想定のサンプルクリニックです。",
    addressText: "福岡県福岡市（サンプル住所）",
  },
  {
    id: "sample-sapporo",
    name: "（サンプル）札幌アイケア&ボトックスクリニック",
    area: "北海道・札幌",
    specialties: ["doubleEyelid", "botox"],
    budgetTier: "premium",
    priceRangeText: "二重埋没法 40,000円〜／ボトックス 25,000円〜",
    description: "二重・ボトックスなど、パーツ・エイジングケア系の施術を扱う想定のサンプルクリニックです。",
    addressText: "北海道札幌市（サンプル住所）",
  },
];

export const CLINIC_AREAS: string[] = Array.from(new Set(CLINICS.map((c) => c.area)));
