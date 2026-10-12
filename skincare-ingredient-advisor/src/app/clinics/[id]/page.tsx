"use client";

import { use } from "react";
import Link from "next/link";
import { AESTHETIC_CATEGORY_ICON, AESTHETIC_CATEGORY_LABELS } from "@/data/aestheticTreatments";
import { CLINICS } from "@/data/clinics";
import { BUDGET_LABELS } from "@/lib/types";
import { Icon } from "@/components/icons";

export default function ClinicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const clinic = CLINICS.find((c) => c.id === id);

  if (!clinic) {
    return (
      <div className="flex flex-col gap-3 pt-8 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">クリニックが見つかりませんでした。</p>
        <Link href="/clinics" className="text-xs font-semibold text-[var(--accent)] underline">
          ← クリニック一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/clinics" className="text-xs font-semibold text-[var(--foreground-muted)]">
        ← クリニック一覧
      </Link>

      <header>
        <h1 className="text-lg font-bold">{clinic.name}</h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
          <Icon name="pin" className="h-4 w-4" />
          {clinic.addressText}
        </p>
      </header>

      <div className="flex items-start gap-1.5 rounded-xl bg-[var(--card)] p-2.5 text-[11px] leading-relaxed text-[var(--foreground-muted)]">
        <Icon name="warning" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        これはサンプル（仮データ）のクリニック情報です。実在のクリニックとの提携はまだありません。
      </div>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
        <p className="text-sm leading-relaxed text-[var(--foreground)]">{clinic.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {clinic.specialties.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]"
            >
              <Icon name={AESTHETIC_CATEGORY_ICON[s]} className="h-3.5 w-3.5" />
              {AESTHETIC_CATEGORY_LABELS[s]}
            </span>
          ))}
        </div>

        <dl className="mt-3 grid grid-cols-1 gap-2 text-xs">
          <div className="rounded-xl bg-[var(--background)] p-2.5">
            <dt className="flex items-center gap-1 font-semibold text-[var(--foreground-muted)]">
              <Icon name="money" className="h-3.5 w-3.5" />
              価格帯
            </dt>
            <dd className="mt-0.5 text-[var(--foreground)]">{clinic.priceRangeText}</dd>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-2.5">
            <dt className="font-semibold text-[var(--foreground-muted)]">想定予算帯</dt>
            <dd className="mt-0.5 text-[var(--foreground)]">{BUDGET_LABELS[clinic.budgetTier]}</dd>
          </div>
        </dl>
      </section>

      <a
        href={`mailto:demo-inquiry@example.com?subject=${encodeURIComponent(`【デモ】${clinic.name}へのお問い合わせ`)}`}
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--accent-contrast)]"
      >
        <Icon name="mail" className="h-4 w-4" />
        お問い合わせ（デモ）
      </a>
      <p className="text-center text-[11px] text-[var(--foreground-muted)]">
        ※ このボタンはデモ機能です。実際の予約・送客には、クリニックとの提携および問い合わせ・予約システムの実装が別途必要です。
      </p>
    </div>
  );
}
