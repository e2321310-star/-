"use client";

import { useEffect, useState } from "react";
import { getAllDiagnoses, getAllProducts, getProfile } from "@/lib/db";
import { buildDiagnosis } from "@/lib/recommend";
import {
  CATEGORY_LABELS,
  CONCERN_LABELS,
  type CareStep,
  type ConcernKey,
  type DiagnosisResult,
} from "@/lib/types";
import { CATEGORY_ICON, CONCERN_BADGE_CLASS, CONCERN_DOT_CLASS } from "@/lib/theme";
import { FOOD_ADVICE } from "@/data/seedFoods";
import { analyzePhotoBlob, type PhotoAnalysis } from "@/lib/photoAnalysis";
import PhotoAnalysisPanel from "@/components/PhotoAnalysisPanel";

const TOP_N = 2;

const VERDICT_STYLE: Record<CareStep["verdict"], string> = {
  keep: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  change: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "no-data": "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400",
};

const VERDICT_LABEL: Record<CareStep["verdict"], string> = {
  keep: "✅ 今のままでOK",
  change: "🔄 見直しを検討",
  "no-data": "－ 未入力",
};

export default function ResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);

  useEffect(() => {
    Promise.all([getAllDiagnoses(), getAllProducts(), getProfile()]).then(
      async ([diagnoses, products, profile]) => {
        const latest = diagnoses[0];
        if (latest) {
          setHasData(true);
          let analysis: PhotoAnalysis | null = null;
          if (latest.photo) {
            setPhotoUrl(URL.createObjectURL(latest.photo));
            analysis = await analyzePhotoBlob(latest.photo);
            setPhotoAnalysis(analysis);
          }
          setResult(buildDiagnosis(latest, products, analysis?.concernSignals, profile.currentRoutine));
        }
        setLoading(false);
      }
    );
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
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 text-sm text-neutral-500 dark:text-neutral-400">
          まだ診断データがありません。診断画面から入力してください。
        </div>
      )}

      {!loading && hasData && result && <ScoreBlock skinScore={result.skinScore} skinAge={result.skinAge} />}

      {!loading && hasData && result && result.rankedConcerns.length === 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 p-4 text-sm font-medium text-white shadow-lg shadow-pink-900/15">
          現在、特に気になる部位はありません。今のケアを維持しましょう。
        </div>
      )}

      {!loading && hasData && result && result.rankedConcerns.length > 0 && (
        <>
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-bold">不足傾向の成分</h2>
            <div className="flex flex-wrap gap-1.5">
              {result.rankedConcerns.map((r) => (
                <span
                  key={r.concern}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${CONCERN_BADGE_CLASS[r.concern]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${CONCERN_DOT_CLASS[r.concern]}`} />
                  {CONCERN_LABELS[r.concern]}
                  {photoAnalysis?.concernSignals[r.concern] != null && <span title="写真からも検出">📷</span>}
                </span>
              ))}
            </div>
          </section>

          {photoUrl && photoAnalysis && (
            <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
              <h2 className="mb-2 text-sm font-bold">📷 写真のどこを見て判断しているか</h2>
              <PhotoAnalysisPanel photoUrl={photoUrl} analysis={photoAnalysis} />
            </section>
          )}

          <CareBlock title="朝のケア" emoji="☀️" steps={result.am} />
          <CareBlock title="夜のケア" emoji="🌙" steps={result.pm} />
          <FoodBlock concerns={result.rankedConcerns.slice(0, TOP_N).map((r) => r.concern)} />
        </>
      )}
    </div>
  );
}

function ScoreBlock({ skinScore, skinAge }: { skinScore: number; skinAge: number }) {
  return (
    <section className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 text-white shadow-lg shadow-blue-900/15">
        <p className="text-xs font-medium text-sky-50/90">肌点数</p>
        <p className="mt-1 text-3xl font-bold">
          {skinScore}
          <span className="text-base font-medium">点</span>
        </p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 p-4 text-white shadow-lg shadow-pink-900/15">
        <p className="text-xs font-medium text-pink-50/90">肌年齢</p>
        <p className="mt-1 text-3xl font-bold">
          {skinAge}
          <span className="text-base font-medium">歳</span>
        </p>
      </div>
      <p className="col-span-2 text-[11px] text-neutral-400">
        セルフチェック・写真解析などから算出した参考値です。医学的な測定値ではありません。
      </p>
    </section>
  );
}

function FoodBlock({ concerns }: { concerns: ConcernKey[] }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
        <span>🍽️</span>
        今日食べたい食べ物
      </h2>
      <div className="flex flex-col gap-2.5">
        {concerns.map((concern) => (
          <div
            key={concern}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3.5 shadow-sm"
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CONCERN_BADGE_CLASS[concern]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${CONCERN_DOT_CLASS[concern]}`} />
              {CONCERN_LABELS[concern]}対策
            </span>
            <ul className="mt-2 flex flex-col gap-1.5">
              {FOOD_ADVICE[concern].map((tip) => (
                <li key={tip.food} className="rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs dark:bg-white/5">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{tip.food}</span>
                  <span className="ml-1 text-neutral-500 dark:text-neutral-400">－ {tip.benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-neutral-400">
        一般的な栄養情報の参考です。持病やアレルギーがある場合は医師・管理栄養士にご相談ください。
      </p>
    </section>
  );
}

function CareBlock({ title, emoji, steps }: { title: string; emoji: string; steps: CareStep[] }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
        <span>{emoji}</span>
        {title}
        <span className="text-xs font-normal text-neutral-400">（上から順番に）</span>
      </h2>
      <ol className="flex flex-col gap-2.5">
        {steps.map((step) => (
          <li
            key={step.category}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3.5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-50 text-base dark:bg-pink-500/15">
                {CATEGORY_ICON[step.category]}
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
                {step.order}
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

            <div className="mt-2.5 border-t border-[var(--card-border)] pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  今使っている商品:{" "}
                  {step.currentProduct?.brand || step.currentProduct?.name
                    ? `${step.currentProduct.brand} ${step.currentProduct.name}`.trim()
                    : "未入力"}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${VERDICT_STYLE[step.verdict]}`}
                >
                  {VERDICT_LABEL[step.verdict]}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">{step.verdictReason}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
