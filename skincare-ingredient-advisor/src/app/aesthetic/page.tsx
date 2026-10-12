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
import { Icon } from "@/components/icons";

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
    return <p className="pt-10 text-center text-sm text-[var(--foreground-muted)]">読み込み中…</p>;
  }

  if (interestScope !== "skincare_and_aesthetic") {
    return (
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-lg font-bold">整形・美容医療</h1>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            スキンケアだけでなく、美容医療にも興味がある方向けの参考情報です。
          </p>
        </header>
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
          <p className="text-sm font-semibold">美容医療にも興味がありますか？</p>
          <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
            「興味あり」に変更すると、施術カテゴリごとの概要・費用の目安・ダウンタイムを確認できます。あとからマイページでいつでも変更できます。
          </p>
          <button
            onClick={enableInterest}
            className="mt-4 rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-contrast)]"
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
        <h1 className="text-lg font-bold">整形・美容医療</h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
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
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon name={AESTHETIC_CATEGORY_ICON[t.category]} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[var(--foreground-muted)]">{AESTHETIC_CATEGORY_LABELS[t.category]}</p>
                <p className="text-sm font-bold">{t.name}</p>
              </div>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[var(--foreground)]">{t.overview}</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-xs">
              <div className="rounded-xl bg-[var(--background)] p-2.5">
                <dt className="flex items-center gap-1 font-semibold text-[var(--foreground-muted)]">
                  <Icon name="money" className="h-3.5 w-3.5" />
                  費用の目安
                </dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{t.costRangeText}</dd>
              </div>
              <div className="rounded-xl bg-[var(--background)] p-2.5">
                <dt className="flex items-center gap-1 font-semibold text-[var(--foreground-muted)]">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  ダウンタイムの目安
                </dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{t.downtimeText}</dd>
              </div>
            </dl>
            <p className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-[var(--background)] p-2.5 text-[11px] leading-relaxed text-[var(--foreground-muted)]">
              <Icon name="warning" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t.cautionNote}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-xl bg-[var(--card)] p-3 text-[11px] leading-relaxed text-[var(--foreground-muted)]">
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
        active ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--card)] text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}
