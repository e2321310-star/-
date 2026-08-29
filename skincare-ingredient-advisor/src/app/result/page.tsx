"use client";

import { useEffect, useState } from "react";
import { getAllDiagnoses, getAllProducts } from "@/lib/db";
import { buildDiagnosis } from "@/lib/recommend";
import { CATEGORY_LABELS, CONCERN_LABELS, type CareStep, type DiagnosisResult } from "@/lib/types";
import { CATEGORY_ICON, CONCERN_BADGE_CLASS, CONCERN_DOT_CLASS } from "@/lib/theme";

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
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          不足していそうな成分と、朝晩それぞれのブランド別おすすめ商品を表示します。
        </p>
      </header>

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading && !hasData && (
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-sm text-neutral-500 dark:text-neutral-400">
          まだ診断データがありません。診断画面から入力してください。
        </div>
      )}

      {!loading && hasData && result && result.rankedConcerns.length === 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-4 text-sm font-medium text-white shadow-lg shadow-teal-900/10">
          現在、特に気になる部位はありません。今のケアを維持しましょう。
        </div>
      )}

      {!loading && hasData && result && result.rankedConcerns.length > 0 && (
        <>
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-bold">不足傾向の成分</h2>
            <div className="flex flex-wrap gap-1.5">
              {result.rankedConcerns.map((r) => (
                <span
                  key={r.concern}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${CONCERN_BADGE_CLASS[r.concern]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${CONCERN_DOT_CLASS[r.concern]}`} />
                  {CONCERN_LABELS[r.concern]}
                </span>
              ))}
            </div>
          </section>

          <CareBlock title="朝のケア" emoji="☀️" steps={result.am} />
          <CareBlock title="夜のケア" emoji="🌙" steps={result.pm} />
        </>
      )}
    </div>
  );
}

function CareBlock({ title, emoji, steps }: { title: string; emoji: string; steps: CareStep[] }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
        <span>{emoji}</span>
        {title}
      </h2>
      <ol className="flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <li
            key={`${step.category}-${i}`}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-base dark:bg-teal-950/50">
                {CATEGORY_ICON[step.category]}
              </span>
              <span className="text-sm font-semibold">{CATEGORY_LABELS[step.category]}</span>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{step.reason}</p>
            {step.products.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-1.5">
                {step.products.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-start gap-2 rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs dark:bg-white/5"
                  >
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${CONCERN_DOT_CLASS[p.concern]}`} />
                    <span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-100">{p.brand}</span>
                      <span className="text-neutral-600 dark:text-neutral-300"> {p.name}</span>
                      <span className="ml-1 text-neutral-400">（{p.ingredient}）</span>
                    </span>
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
