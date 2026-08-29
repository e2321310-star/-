import type { ConcernKey } from "@/lib/types";

export interface FoodTip {
  food: string;
  benefit: string;
}

// 悩み別の食事アドバイス（一般的な栄養知識の参考情報。医療的な助言ではありません）
export const FOOD_ADVICE: Record<ConcernKey, FoodTip[]> = {
  pores: [
    { food: "牡蠣・赤身肉・卵（亜鉛）", benefit: "皮脂バランスとターンオーバーをサポート" },
    { food: "納豆・レバー・バナナ（ビタミンB2/B6）", benefit: "皮脂分泌の調整を助ける" },
  ],
  brightening: [
    { food: "キウイ・パプリカ・いちご（ビタミンC）", benefit: "メラニン生成を抑え透明感をサポート" },
    { food: "トマト（リコピン）", benefit: "抗酸化作用で紫外線ダメージをケア" },
  ],
  dryness: [
    { food: "青魚・くるみ・亜麻仁油（オメガ3脂肪酸）", benefit: "皮脂膜を整えうるおいを保持" },
    { food: "にんじん・かぼちゃ・レバー（ビタミンA）", benefit: "肌の健康な状態づくりをサポート" },
  ],
  oiliness: [
    { food: "豚肉・玄米・バナナ（ビタミンB2/B6）", benefit: "皮脂代謝のサポート" },
    { food: "野菜・海藻・きのこ（食物繊維）", benefit: "腸内環境を整え皮脂バランスに配慮" },
  ],
  firmness: [
    { food: "鶏むね肉・豆腐・卵（たんぱく質）", benefit: "コラーゲン生成の材料になる" },
    { food: "パプリカ・柑橘類（ビタミンC）", benefit: "コラーゲンの合成をサポート" },
  ],
  soothing: [
    { food: "ヨーグルト・味噌・キムチ（発酵食品）", benefit: "腸内環境を整えて肌荒れをケア" },
    { food: "緑黄色野菜・ナッツ（ビタミンA/E）", benefit: "肌のバリア機能をサポート" },
  ],
};
