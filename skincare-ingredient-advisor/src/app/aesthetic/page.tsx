"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/db";
import {
  AESTHETIC_CATEGORY_ICON,
  AESTHETIC_CATEGORY_LABELS,
  AESTHETIC_TREATMENTS,
  type AestheticTreatment,
} from "@/data/aestheticTreatments";
import { BUDGET_LABELS, BUDGET_ORDER, type Budget, type InterestScope } from "@/lib/types";

export default function AestheticPage() {
  const [loading, setLoading] = useState(true);
  const [interestScope, setInterestScope] = useState<InterestScope | undefined>(undefined);
  const [budgetFilter, setBudgetFilter] = useState<Budget | "all">("all");

  useEffect(() => {
    getProfile().then((p) => {
      setInterestScope(p.interestScope);
      setBudgetFilter(p.budget ?? "all");
      setLoading(false);
    });
  }, []);

  async function enableInterest() {
    const existing = await getProfile();
    await saveProfile({ ...existing, id: "default", interestScope: "skincare_and_aesthetic" });
    setInterestScope("skincare_and_aesthetic");
  }

  if (loading) {
    return <p className="pt-10 text-center text-sm text-neutral-400">読み込み中…</p>;
  }

  if (interestScope !== "skincare_and_aesthetic") {
    return (
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-lg font-bold">✨ 整形・美容医療</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            スキンケアだけでなく、美容医療にも興味がある方向けの参考情報です。
          </p>
        </header>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-5 text-center">
          <p className="text-sm font-semibold">美容医療にも興味がありますか？</p>
          <p className="mt-1.5 text-xs text-neutral-400">
            「興味あり」に変更すると、施術カテゴリごとの概要・費用の目安・ダウンタイムを確認できます。あとからマイページでいつでも変更できます。
          </p>
          <button
            onClick={enableInterest}
            className="mt-4 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white"
          >
            興味ありに変更する
          </button>
        </div>
      </div>
    );
  }

  const filtered: AestheticTreatment[] = AESTHETIC_TREATMENTS.filter(
    (t) => budgetFilter === "all" || t.budgetTier === budgetFilter
  );

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">✨ 整形・美容医療</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          施術カテゴリごとの概要・費用目安・ダウンタイムをまとめた参考情報です。
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={budgetFilter === "all"} onClick={() => setBudgetFilter("all")} label="すべて" />
        {BUDGET_ORDER.map((b) => (
          <FilterChip key={b} active={budgetFilter === b} onClick={() => setBudgetFilter(b)} label={BUDGET_LABELS[b]} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-white/10">
                {AESTHETIC_CATEGORY_ICON[t.category]}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-neutral-400">{AESTHETIC_CATEGORY_LABELS[t.category]}</p>
                <p className="text-sm font-bold">{t.name}</p>
              </div>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">{t.overview}</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-xs">
              <div className="rounded-xl bg-neutral-50 p-2.5 dark:bg-white/5">
                <dt className="font-semibold text-neutral-400">💴 費用の目安</dt>
                <dd className="mt-0.5 text-neutral-600 dark:text-neutral-300">{t.costRangeText}</dd>
              </div>
              <div className="rounded-xl bg-neutral-50 p-2.5 dark:bg-white/5">
                <dt className="font-semibold text-neutral-400">🕒 ダウンタイムの目安</dt>
                <dd className="mt-0.5 text-neutral-600 dark:text-neutral-300">{t.downtimeText}</dd>
              </div>
            </dl>
            <p className="mt-2.5 rounded-xl bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              ⚠️ {t.cautionNote}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl bg-neutral-100 p-3 text-[11px] leading-relaxed text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
        掲載内容は一般的な情報の紹介であり、効果を保証するものではありません。施術の適否・リスクは医師の診察・カウンセリングで個別にご確認ください。費用は目安であり、クリニックや症状により異なります。
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
