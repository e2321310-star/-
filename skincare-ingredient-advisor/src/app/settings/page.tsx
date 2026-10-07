"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/db";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CONCERN_LABELS,
  CONCERN_ORDER,
  GENDER_LABELS,
  GENDER_ORDER,
  LIFESTYLE_LABELS,
  LIFESTYLE_ORDER,
  SKIN_TYPE_LABELS,
  SKIN_TYPE_ORDER,
  type ConcernKey,
  type CurrentRoutineByPeriod,
  type Gender,
  type Lifestyle,
  type ProductCategory,
  type SkinType,
} from "@/lib/types";
import { CATEGORY_ICON, CONCERN_BADGE_CLASS } from "@/lib/theme";
import { AM_CATEGORIES, PM_CATEGORIES } from "@/lib/recommend";

type RoutineState = Partial<Record<ProductCategory, CurrentRoutineByPeriod>>;
type RoutinePeriod = "am" | "pm";

export default function SettingsPage() {
  const [skinType, setSkinType] = useState<SkinType | undefined>(undefined);
  const [favoriteBrands, setFavoriteBrands] = useState("");
  const [currentRoutine, setCurrentRoutine] = useState<RoutineState>({});
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [lifestyle, setLifestyle] = useState<Lifestyle | undefined>(undefined);
  const [goalConcern, setGoalConcern] = useState<ConcernKey | undefined>(undefined);
  const [goalNote, setGoalNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((p) => {
      setSkinType(p.skinType);
      setFavoriteBrands(p.favoriteBrands ?? "");
      setCurrentRoutine(p.currentRoutine ?? {});
      setAge(p.age != null ? String(p.age) : "");
      setGender(p.gender);
      setLifestyle(p.lifestyle);
      setGoalConcern(p.goalConcern);
      setGoalNote(p.goalNote ?? "");
      setLoading(false);
    });
  }, []);

  function updateRoutine(category: ProductCategory, period: RoutinePeriod, field: "brand" | "name", value: string) {
    setCurrentRoutine((prev) => {
      const prevForCategory = prev[category] ?? {};
      const prevItem = prevForCategory[period] ?? { brand: "", name: "" };
      return {
        ...prev,
        [category]: { ...prevForCategory, [period]: { ...prevItem, [field]: value } },
      };
    });
  }

  async function handleSave() {
    await saveProfile({
      id: "default",
      skinType,
      favoriteBrands: favoriteBrands.trim(),
      currentRoutine,
      age: age.trim() === "" ? undefined : Number(age),
      gender,
      lifestyle,
      goalConcern,
      goalNote: goalNote.trim(),
    });
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">プロフィール</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          肌質やお気に入りブランドなど、診断に使う登録情報です。
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-400">読み込み中…</p>
      ) : (
        <>
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold">年齢・性別</h2>
            <p className="mt-1 text-xs text-neutral-400">診断結果の肌年齢との比較に使われます</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="例：28（歳）"
                className="rounded-lg border border-[var(--card-border)] bg-neutral-50 px-3 py-2 text-sm dark:bg-white/5"
              />
              <div className="grid grid-cols-1 gap-1.5">
                <select
                  value={gender ?? ""}
                  onChange={(e) => setGender((e.target.value || undefined) as Gender | undefined)}
                  className="rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2.5 py-2 text-sm dark:bg-white/5"
                >
                  <option value="">性別を選択</option>
                  {GENDER_ORDER.map((g) => (
                    <option key={g} value={g}>
                      {GENDER_LABELS[g]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold">肌質</h2>
            <p className="mt-1 text-xs text-neutral-400">
              診断画面での初期値として使われます（診断のたびに変更もできます）
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {SKIN_TYPE_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSkinType(type)}
                  aria-pressed={skinType === type}
                  className={`rounded-lg py-2 text-center text-xs font-semibold transition-colors ${
                    skinType === type
                      ? "bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-sm shadow-pink-900/20"
                      : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                  }`}
                >
                  {SKIN_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold">⏱️ ライフスタイル</h2>
            <p className="mt-1 text-xs text-neutral-400">
              忙しさやメイクの有無に合わせて、朝晩のおすすめステップ数や文言を調整します。
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {LIFESTYLE_ORDER.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLifestyle(lifestyle === l ? undefined : l)}
                  aria-pressed={lifestyle === l}
                  className={`rounded-lg py-2 text-center text-xs font-semibold transition-colors ${
                    lifestyle === l
                      ? "bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-sm shadow-pink-900/20"
                      : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                  }`}
                >
                  {LIFESTYLE_LABELS[l]}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold">🎯 将来なりたい肌</h2>
            <p className="mt-1 text-xs text-neutral-400">
              長期的な目標を1つ設定すると、その日の悩みに出ていなくても、目標に向けたケアを診断結果に含めます。
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CONCERN_ORDER.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setGoalConcern(goalConcern === c ? undefined : c)}
                  aria-pressed={goalConcern === c}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    goalConcern === c
                      ? CONCERN_BADGE_CLASS[c]
                      : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                  }`}
                >
                  {CONCERN_LABELS[c]}レス
                </button>
              ))}
            </div>
            <input
              type="text"
              value={goalNote}
              onChange={(e) => setGoalNote(e.target.value)}
              placeholder="目標のメモ（任意）例：毛穴レスな陶器肌になりたい"
              className="mt-2 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-3 py-2 text-sm dark:bg-white/5"
            />
          </section>

          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold">今使っているスキンケア</h2>
            <p className="mt-1 text-xs text-neutral-400">
              診断結果画面で「今のままでOK」か「見直しを検討」かの目安を、朝・夜それぞれ別々に表示します。
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {CATEGORY_ORDER.map((category) => {
                const isAM = AM_CATEGORIES.includes(category);
                const isPM = PM_CATEGORIES.includes(category);
                const periods: RoutinePeriod[] = isAM && isPM ? ["am", "pm"] : isAM ? ["am"] : ["pm"];
                return (
                  <div key={category}>
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      <span>{CATEGORY_ICON[category]}</span>
                      {CATEGORY_LABELS[category]}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {periods.map((period) => (
                        <div key={period} className="flex items-center gap-1.5">
                          {isAM && isPM && (
                            <span className="w-7 shrink-0 text-center text-xs">
                              {period === "am" ? "☀️" : "🌙"}
                            </span>
                          )}
                          <input
                            type="text"
                            value={currentRoutine[category]?.[period]?.brand ?? ""}
                            onChange={(e) => updateRoutine(category, period, "brand", e.target.value)}
                            placeholder="ブランド名"
                            className="min-w-0 flex-1 rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2.5 py-1.5 text-xs dark:bg-white/5"
                          />
                          <input
                            type="text"
                            value={currentRoutine[category]?.[period]?.name ?? ""}
                            onChange={(e) => updateRoutine(category, period, "name", e.target.value)}
                            placeholder="商品名"
                            className="min-w-0 flex-1 rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2.5 py-1.5 text-xs dark:bg-white/5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold">お気に入りブランド（任意）</h2>
            <input
              type="text"
              value={favoriteBrands}
              onChange={(e) => setFavoriteBrands(e.target.value)}
              placeholder="例：無印良品、キュレル"
              className="mt-2 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-3 py-2 text-sm dark:bg-white/5"
            />
          </section>

          <button
            onClick={handleSave}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-900/20"
          >
            保存する
          </button>

          {saved && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
              保存しました。
            </div>
          )}
        </>
      )}

      <p className="text-center text-[11px] text-neutral-400">
        入力内容はすべて端末内に保存され、外部には送信されません。
      </p>
    </div>
  );
}
