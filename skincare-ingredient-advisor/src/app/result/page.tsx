"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAllDiagnoses, getAllProducts, getProfile } from "@/lib/db";
import { buildDiagnosis } from "@/lib/recommend";
import { formatDateJa } from "@/lib/date";
import {
  CATEGORY_LABELS,
  CONCERN_LABELS,
  PRICE_RANGE_LABELS,
  type CareStep,
  type ConcernContribution,
  type ConcernKey,
  type DiagnosisResult,
  type Roadmap,
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
  return (
    <Suspense fallback={<p className="text-sm text-neutral-400">読み込み中…</p>}>
      <ResultPageInner />
    </Suspense>
  );
}

function ResultPageInner() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [recordDate, setRecordDate] = useState<string | null>(null);
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [realAge, setRealAge] = useState<number | undefined>(undefined);

  useEffect(() => {
    Promise.all([getAllDiagnoses(), getAllProducts(), getProfile()]).then(
      async ([diagnoses, products, profile]) => {
        setLatestDate(diagnoses[0]?.date ?? null);
        setRealAge(profile.age);
        const target = dateParam ? diagnoses.find((d) => d.date === dateParam) : diagnoses[0];
        if (target) {
          setHasData(true);
          setRecordDate(target.date);
          let analysis: PhotoAnalysis | null = null;
          if (target.photo) {
            setPhotoUrl(URL.createObjectURL(target.photo));
            analysis = await analyzePhotoBlob(target.photo);
            setPhotoAnalysis(analysis);
          } else {
            setPhotoUrl(null);
            setPhotoAnalysis(null);
          }
          setResult(
            buildDiagnosis(
              target,
              products,
              analysis?.concernSignals,
              profile.currentRoutine,
              profile.goalConcern ? { concern: profile.goalConcern, note: profile.goalNote } : undefined
            )
          );
        } else {
          setHasData(false);
        }
        setLoading(false);
      }
    );
  }, [dateParam]);

  const viewingPast = !!dateParam && dateParam !== latestDate;

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">
          診断結果{recordDate ? `（${formatDateJa(recordDate)}）` : ""}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          不足していそうな成分と、朝晩それぞれのブランド別おすすめ商品を表示します。
        </p>
        {viewingPast && (
          <Link
            href="/result"
            className="mt-1 inline-block text-xs font-semibold text-pink-600 underline dark:text-pink-400"
          >
            → 最新の診断結果を見る
          </Link>
        )}
      </header>

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading && !hasData && (
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 text-sm text-neutral-500 dark:text-neutral-400">
          {dateParam
            ? "この日の診断データが見つかりませんでした。"
            : "まだ診断データがありません。診断画面から入力してください。"}
        </div>
      )}

      {!loading && hasData && result?.roadmap && <RoadmapBlock roadmap={result.roadmap} />}

      {!loading && hasData && result && (
        <ScoreBlock
          skinScore={result.skinScore}
          skinAge={result.skinAge}
          realAge={realAge}
          rankedConcerns={result.rankedConcerns}
          explanation={result.scoreExplanation}
        />
      )}

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

          <div className="rounded-2xl bg-neutral-100 p-3 text-[11px] text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
            💡 朝と夜でおすすめの内容は変えています。朝は日中のくずれ・乾燥を防ぐ軽めのケア、夜はパックを含めた集中的な補修ケアです。
          </div>

          <CareBlock title="朝のケア" emoji="☀️" steps={result.am} />
          <CareBlock title="夜のケア" emoji="🌙" steps={result.pm} />
          <FoodBlock concerns={result.rankedConcerns.slice(0, TOP_N).map((r) => r.concern)} />
        </>
      )}
    </div>
  );
}

const STAGE_STYLE: Record<Roadmap["stage"], string> = {
  1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  2: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  3: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

function RoadmapBlock({ roadmap }: { roadmap: Roadmap }) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold">🎯 なりたい肌へのロードマップ</h2>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STAGE_STYLE[roadmap.stage]}`}>
          Step {roadmap.stage}/3 ・ {roadmap.stageLabel}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-semibold">{CONCERN_LABELS[roadmap.goalConcern]}レスな肌が目標</p>
      {roadmap.goalNote && <p className="mt-0.5 text-xs text-neutral-400">「{roadmap.goalNote}」</p>}
      <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">{roadmap.message}</p>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= roadmap.stage ? "bg-gradient-to-r from-pink-500 to-violet-500" : "bg-neutral-200 dark:bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] text-neutral-400">プロフィール画面でいつでも目標を変更できます。</p>
    </section>
  );
}

function ScoreBlock({
  skinScore,
  skinAge,
  realAge,
  rankedConcerns,
  explanation,
}: {
  skinScore: number;
  skinAge: number;
  realAge?: number;
  rankedConcerns: ConcernContribution[];
  explanation: string;
}) {
  const diff = realAge != null ? skinAge - realAge : null;
  const diffLabel =
    diff == null
      ? null
      : diff <= -2
        ? `実年齢より${Math.abs(diff)}歳若め ✨`
        : diff >= 2
          ? `実年齢より${diff}歳高め`
          : "実年齢とほぼ同じ";

  return (
    <section className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-3">
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
          {diffLabel && <p className="mt-0.5 text-[11px] text-pink-50/90">{diffLabel}</p>}
        </div>
      </div>

      {rankedConcerns.length > 0 && (
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3.5 shadow-sm">
          <p className="text-xs font-bold">点数の内訳</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {rankedConcerns.map((r) => (
              <li key={r.concern} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-neutral-600 dark:text-neutral-300">
                  {CONCERN_LABELS[r.concern]}
                  <span className="ml-1 text-neutral-400">（{r.sources.join("・")}）</span>
                </span>
                <span className="shrink-0 font-semibold text-orange-600 dark:text-orange-400">
                  -{r.deduction}点
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-neutral-400">{explanation}</p>
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
        持病やアレルギーがある場合は、医師・管理栄養士に相談してから取り入れてください。
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
              <ul className="mt-2 flex flex-col gap-2">
                {step.products.map((p) => (
                  <li key={p.id} className="rounded-xl bg-neutral-50 p-2.5 text-xs dark:bg-white/5">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${CONCERN_DOT_CLASS[p.concern]}`} />
                      <span className="min-w-0">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">{p.brand}</span>
                        <span className="text-neutral-600 dark:text-neutral-300"> {p.name}</span>
                        <span className="ml-1 text-neutral-400">（{p.ingredient}）</span>
                      </span>
                    </div>
                    {(p.priceRange || p.price || p.link) && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-3.5">
                        {p.priceRange && (
                          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                            {PRICE_RANGE_LABELS[p.priceRange]}
                          </span>
                        )}
                        {p.price && (
                          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                            {p.price}
                          </span>
                        )}
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-2.5 py-1 text-[10px] font-semibold text-white"
                          >
                            🔗 商品を見る
                          </a>
                        )}
                      </div>
                    )}
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
