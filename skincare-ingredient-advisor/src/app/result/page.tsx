"use client";

import { useEffect, useState } from "react";
import { getAllDiagnoses, getAllProducts } from "@/lib/db";
import { buildDiagnosis } from "@/lib/recommend";
import { CATEGORY_LABELS, CONCERN_LABELS, type CareStep, type DiagnosisResult } from "@/lib/types";

export default function ResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllDiagnoses(), getAllProducts()]).then(([diagnoses, products]) => {
      const latest = diagnoses[0];
      if (latest) {
        setHasData(true);
        setResult(buildDiagnosis(latest, products));
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">診断結果</h1>
        <p className="text-sm text-neutral-500">
          不足していそうな成分と、朝晩それぞれのブランド別おすすめ商品を表示します。
        </p>
      </header>

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading && !hasData && (
        <div className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-500 dark:bg-neutral-900">
          まだ診断データがありません。診断画面から入力してください。
        </div>
      )}

      {!loading && hasData && result && result.rankedConcerns.length === 0 && (
        <div className="rounded-xl bg-teal-50 p-4 text-sm font-medium text-teal-700 dark:bg-teal-950/30 dark:text-teal-300">
          現在、特に気になる部位はありません。今のケアを維持しましょう。
        </div>
      )}

      {!loading && hasData && result && result.rankedConcerns.length > 0 && (
        <>
          <section>
            <h2 className="mb-2 text-sm font-bold">不足傾向の成分</h2>
            <div className="flex flex-wrap gap-1.5">
              {result.rankedConcerns.map((r) => (
                <span
                  key={r.concern}
                  className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                >
                  {CONCERN_LABELS[r.concern]}
                </span>
              ))}
            </div>
          </section>

          <CareBlock title="☀️ 朝のケア" steps={result.am} />
          <CareBlock title="🌙 夜のケア" steps={result.pm} />
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
              <span className="text-sm font-semibold">{CATEGORY_LABELS[step.category]}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{step.reason}</p>
            {step.products.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-1.5">
                {step.products.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs dark:bg-teal-950/30"
                  >
                    <span className="font-semibold text-teal-700 dark:text-teal-300">{p.brand}</span>
                    <span className="text-neutral-600 dark:text-neutral-300"> {p.name}</span>
                    <span className="ml-1 text-neutral-400">（{p.ingredient}）</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-neutral-400">該当する商品データがまだ登録されていません</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
