"use client";

import { useEffect, useState } from "react";
import { getAllIngredients, getAllRecords } from "@/lib/db";
import { buildCareSuggestion } from "@/lib/recommend";
import { CARE_CATEGORY_LABELS, CONCERN_LABELS, type CareStep, type CareSuggestion } from "@/lib/types";

export default function CarePage() {
  const [suggestion, setSuggestion] = useState<CareSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllRecords(), getAllIngredients()]).then(([records, ingredients]) => {
      setSuggestion(buildCareSuggestion(records, ingredients));
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">今日のケア提案</h1>
        <p className="text-sm text-neutral-500">
          直近7日間の自己評価をもとに、不足していそうな成分と朝晩のケア工程を提案します。
        </p>
      </header>

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading && suggestion && suggestion.basedOnDays === 0 && (
        <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-500 dark:bg-neutral-900">
          直近の評価記録がありません。まず記録画面で肌状態を入力してください。
        </p>
      )}

      {!loading && suggestion && suggestion.basedOnDays > 0 && (
        <>
          <div className="rounded-xl bg-neutral-100 p-3 text-xs text-neutral-500 dark:bg-neutral-900">
            直近{suggestion.basedOnDays}件の記録を分析しました。
            {suggestion.weakConcerns.length === 0 ? (
              <p className="mt-1 font-medium text-green-600 dark:text-green-400">
                現在、特に低評価な項目はありません。今のケアを維持しましょう。
              </p>
            ) : (
              <p className="mt-1">
                不足傾向：
                {suggestion.weakConcerns
                  .map((w) => `${CONCERN_LABELS[w.concern]}(${w.avg.toFixed(1)})`)
                  .join("、")}
              </p>
            )}
          </div>

          <CareBlock title="☀️ 朝のケア" steps={suggestion.am} />
          <CareBlock title="🌙 夜のケア" steps={suggestion.pm} />
        </>
      )}
    </div>
  );
}

function CareBlock({ title, steps }: { title: string; steps: CareStep[] }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold">{title}</h2>
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li
            key={`${step.category}-${i}`}
            className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
                {i + 1}
              </span>
              <span className="text-sm font-semibold">{CARE_CATEGORY_LABELS[step.category]}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{step.reason}</p>
            {step.ingredients.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {step.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-medium text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
