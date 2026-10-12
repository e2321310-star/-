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
  PRODUCT_REGION_LABELS,
  type CareStep,
  type ConcernContribution,
  type ConcernKey,
  type DiagnosisResult,
  type Roadmap,
} from "@/lib/types";
import { CATEGORY_ICON, CONCERN_BADGE_CLASS, CONCERN_DOT_CLASS, PRODUCT_REGION_BADGE_CLASS } from "@/lib/theme";
import { FOOD_ADVICE } from "@/data/seedFoods";
import { analyzePhotoBlob, type PhotoAnalysis } from "@/lib/photoAnalysis";
import PhotoAnalysisPanel from "@/components/PhotoAnalysisPanel";
import { Icon, type IconName } from "@/components/icons";

const TOP_N = 2;

const VERDICT_STYLE: Record<CareStep["verdict"], string> = {
  keep: "bg-[var(--accent-soft)] text-[var(--foreground)]",
  change: "bg-[var(--card)] text-[var(--foreground)]",
  "no-data": "bg-[var(--card)] text-[var(--foreground-muted)]",
};

const VERDICT_ICON: Record<CareStep["verdict"], IconName> = {
  keep: "check",
  change: "refresh",
  "no-data": "dot",
};

const VERDICT_LABEL: Record<CareStep["verdict"], string> = {
  keep: "今のままでOK",
  change: "見直しを検討",
  "no-data": "未入力",
};

export default function ResultPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--foreground-muted)]">読み込み中…</p>}>
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
              profile.goalConcern ? { concern: profile.goalConcern, note: profile.goalNote } : undefined,
              { age: profile.age, gender: profile.gender, lifestyle: profile.lifestyle }
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
        <p className="text-sm text-[var(--foreground-muted)]">
          不足していそうな成分と、朝晩それぞれのブランド別おすすめ商品を表示します。
        </p>
        {viewingPast && (
          <Link
            href="/result"
            className="mt-1 inline-block text-xs font-semibold text-[var(--accent)] underline"
          >
            → 最新の診断結果を見る
          </Link>
        )}
      </header>

      {loading && <p className="text-sm text-[var(--foreground-muted)]">読み込み中…</p>}

      {!loading && !hasData && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-sm text-[var(--foreground-muted)]">
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
        <div className="rounded-xl bg-[var(--accent-soft)] p-4 text-sm font-medium text-[var(--foreground)]">
          現在、特に気になる部位はありません。今のケアを維持しましょう。
        </div>
      )}

      {!loading && hasData && result && result.rankedConcerns.length > 0 && (
        <>
          <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <h2 className="mb-2 text-sm font-bold">不足傾向の成分</h2>
            <div className="flex flex-wrap gap-1.5">
              {result.rankedConcerns.map((r) => (
                <span
                  key={r.concern}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${CONCERN_BADGE_CLASS[r.concern]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${CONCERN_DOT_CLASS[r.concern]}`} />
                  {CONCERN_LABELS[r.concern]}
                  {photoAnalysis?.concernSignals[r.concern] != null && (
                    <Icon name="camera" className="h-3 w-3" />
                  )}
                </span>
              ))}
            </div>
          </section>

          {photoUrl && photoAnalysis && (
            <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <Icon name="camera" className="h-4 w-4 text-[var(--foreground-muted)]" />
                写真のどこを見て判断しているか
              </h2>
              <PhotoAnalysisPanel photoUrl={photoUrl} analysis={photoAnalysis} />
            </section>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-[var(--card)] p-3 text-[11px] text-[var(--foreground-muted)]">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
            朝と夜でおすすめの内容は変えています。朝は日中のくずれ・乾燥を防ぐ軽めのケア、夜はパックを含めた集中的な補修ケアです。
          </div>

          <CareBlock title="朝のケア" icon="sun" steps={result.am} />
          <CareBlock title="夜のケア" icon="moon" steps={result.pm} />
          <FoodBlock concerns={result.rankedConcerns.slice(0, TOP_N).map((r) => r.concern)} />
        </>
      )}
    </div>
  );
}

function RoadmapBlock({ roadmap }: { roadmap: Roadmap }) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-bold">
          <Icon name="target" className="h-4 w-4 text-[var(--accent)]" />
          なりたい肌へのロードマップ
        </h2>
        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--foreground)]">
          Step {roadmap.stage}/3 ・ {roadmap.stageLabel}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-semibold">{CONCERN_LABELS[roadmap.goalConcern]}レスな肌が目標</p>
      {roadmap.goalNote && <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">「{roadmap.goalNote}」</p>}
      <p className="mt-2 text-xs leading-relaxed text-[var(--foreground)]">{roadmap.message}</p>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: s <= roadmap.stage ? "var(--accent)" : "var(--card-border)" }}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] text-[var(--foreground-muted)]">プロフィール画面でいつでも目標を変更できます。</p>
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
        ? `実年齢より${Math.abs(diff)}歳若め`
        : diff >= 2
          ? `実年齢より${diff}歳高め`
          : "実年齢とほぼ同じ";

  return (
    <section className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">肌点数</p>
          <p className="mt-1 text-3xl font-bold text-[var(--accent)]">
            {skinScore}
            <span className="text-base font-medium text-[var(--foreground)]">点</span>
          </p>
        </div>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">肌年齢</p>
          <p className="mt-1 text-3xl font-bold text-[var(--accent)]">
            {skinAge}
            <span className="text-base font-medium text-[var(--foreground)]">歳</span>
          </p>
          {diffLabel && <p className="mt-0.5 text-[11px] text-[var(--foreground-muted)]">{diffLabel}</p>}
        </div>
      </div>

      {rankedConcerns.length > 0 && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
          <p className="text-xs font-bold">点数の内訳</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {rankedConcerns.map((r) => (
              <li key={r.concern} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-[var(--foreground)]">
                  {CONCERN_LABELS[r.concern]}
                  <span className="ml-1 text-[var(--foreground-muted)]">（{r.sources.join("・")}）</span>
                </span>
                <span className="shrink-0 font-semibold text-[var(--foreground-muted)]">
                  -{r.deduction}点
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-[var(--foreground-muted)]">{explanation}</p>
    </section>
  );
}

function FoodBlock({ concerns }: { concerns: ConcernKey[] }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
        <Icon name="utensils" className="h-4 w-4 text-[var(--foreground-muted)]" />
        今日食べたい食べ物
      </h2>
      <div className="flex flex-col gap-2.5">
        {concerns.map((concern) => (
          <div
            key={concern}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5"
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CONCERN_BADGE_CLASS[concern]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${CONCERN_DOT_CLASS[concern]}`} />
              {CONCERN_LABELS[concern]}対策
            </span>
            <ul className="mt-2 flex flex-col gap-1.5">
              {FOOD_ADVICE[concern].map((tip) => (
                <li key={tip.food} className="rounded-xl bg-[var(--card)] px-2.5 py-1.5 text-xs">
                  <span className="font-semibold text-[var(--foreground)]">{tip.food}</span>
                  <span className="ml-1 text-[var(--foreground-muted)]">－ {tip.benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-[var(--foreground-muted)]">
        持病やアレルギーがある場合は、医師・管理栄養士に相談してから取り入れてください。
      </p>
    </section>
  );
}

function CareBlock({ title, icon, steps }: { title: string; icon: IconName; steps: CareStep[] }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
        <Icon name={icon} className="h-4 w-4 text-[var(--foreground-muted)]" />
        {title}
        <span className="text-xs font-normal text-[var(--foreground-muted)]">（上から順番に）</span>
      </h2>
      <ol className="flex flex-col gap-2.5">
        {steps.map((step) => (
          <li
            key={step.category}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon name={CATEGORY_ICON[step.category]} className="h-4 w-4" />
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-contrast)]">
                {step.order}
              </span>
              <span className="text-sm font-semibold">{CATEGORY_LABELS[step.category]}</span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">{step.reason}</p>
            {step.products.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-2">
                {step.products.map((p) => (
                  <li key={p.id} className="rounded-xl bg-[var(--card)] p-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${CONCERN_DOT_CLASS[p.concern]}`} />
                      <span className="min-w-0">
                        <span className="font-semibold text-[var(--foreground)]">{p.brand}</span>
                        <span className="text-[var(--foreground)]"> {p.name}</span>
                        <span className="ml-1 text-[var(--foreground-muted)]">（{p.ingredient}）</span>
                      </span>
                    </div>
                    {(p.region || p.priceRange || p.price || p.link) && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-3.5">
                        {p.region && p.region !== "jp" && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRODUCT_REGION_BADGE_CLASS[p.region]}`}>
                            {PRODUCT_REGION_LABELS[p.region]}
                          </span>
                        )}
                        {p.priceRange && (
                          <span className="text-[10px] font-semibold text-[var(--foreground-muted)]">
                            {PRICE_RANGE_LABELS[p.priceRange]}
                          </span>
                        )}
                        {p.price && (
                          <span className="text-[10px] font-semibold text-[var(--foreground-muted)]">
                            {p.price}
                          </span>
                        )}
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent-contrast)]"
                          >
                            <Icon name="link" className="h-3 w-3" />
                            商品を見る
                          </a>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-[var(--foreground-muted)]">該当する商品データがまだ登録されていません</p>
            )}

            <div className="mt-2.5 border-t border-[var(--card-border)] pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--foreground-muted)]">
                  今使っている商品:{" "}
                  {step.currentProduct?.brand || step.currentProduct?.name
                    ? `${step.currentProduct.brand} ${step.currentProduct.name}`.trim()
                    : "未入力"}
                </span>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${VERDICT_STYLE[step.verdict]}`}
                >
                  <Icon name={VERDICT_ICON[step.verdict]} className="h-3 w-3" />
                  {VERDICT_LABEL[step.verdict]}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">{step.verdictReason}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
