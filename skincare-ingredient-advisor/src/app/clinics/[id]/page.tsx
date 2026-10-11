"use client";

import { use } from "react";
import Link from "next/link";
import { AESTHETIC_CATEGORY_ICON, AESTHETIC_CATEGORY_LABELS } from "@/data/aestheticTreatments";
import { CLINICS } from "@/data/clinics";
import { BUDGET_LABELS } from "@/lib/types";

export default function ClinicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const clinic = CLINICS.find((c) => c.id === id);

  if (!clinic) {
    return (
      <div className="flex flex-col gap-3 pt-8 text-center">
        <p className="text-sm text-neutral-400">クリニックが見つかりませんでした。</p>
        <Link href="/clinics" className="text-xs font-semibold text-pink-600 underline dark:text-pink-400">
          ← クリニック一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/clinics" className="text-xs font-semibold text-neutral-400">
        ← クリニック一覧
      </Link>

      <header>
        <h1 className="text-lg font-bold">{clinic.name}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">📍 {clinic.addressText}</p>
      </header>

      <div className="rounded-xl bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
        ⚠️ これはサンプル（仮データ）のクリニック情報です。実在のクリニックとの提携はまだありません。
      </div>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{clinic.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {clinic.specialties.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
            >
              {AESTHETIC_CATEGORY_ICON[s]} {AESTHETIC_CATEGORY_LABELS[s]}
            </span>
          ))}
        </div>

        <dl className="mt-3 grid grid-cols-1 gap-2 text-xs">
          <div className="rounded-xl bg-neutral-50 p-2.5 dark:bg-white/5">
            <dt className="font-semibold text-neutral-400">💴 価格帯</dt>
            <dd className="mt-0.5 text-neutral-600 dark:text-neutral-300">{clinic.priceRangeText}</dd>
          </div>
          <div className="rounded-xl bg-neutral-50 p-2.5 dark:bg-white/5">
            <dt className="font-semibold text-neutral-400">💰 想定予算帯</dt>
            <dd className="mt-0.5 text-neutral-600 dark:text-neutral-300">{BUDGET_LABELS[clinic.budgetTier]}</dd>
          </div>
        </dl>
      </section>

      <a
        href={`mailto:demo-inquiry@example.com?subject=${encodeURIComponent(`【デモ】${clinic.name}へのお問い合わせ`)}`}
        className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 py-3 text-sm font-semibold text-white"
      >
        📩 お問い合わせ（デモ）
      </a>
      <p className="text-center text-[11px] text-neutral-400">
        ※ このボタンはデモ機能です。実際の予約・送客には、クリニックとの提携および問い合わせ・予約システムの実装が別途必要です。
      </p>
    </div>
  );
}
