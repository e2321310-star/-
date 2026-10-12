"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/db";
import { AESTHETIC_CATEGORY_ICON, AESTHETIC_CATEGORY_LABELS } from "@/data/aestheticTreatments";
import { CLINICS, CLINIC_AREAS } from "@/data/clinics";
import { BUDGET_LABELS, BUDGET_ORDER, type Budget } from "@/lib/types";
import { Icon } from "@/components/icons";

export default function ClinicsPage() {
  const [area, setArea] = useState<string | "all">("all");
  const [budgetFilter, setBudgetFilter] = useState<Budget | "all">("all");

  useEffect(() => {
    getProfile().then((p) => {
      if (p.budget) setBudgetFilter(p.budget);
    });
  }, []);

  const filtered = CLINICS.filter(
    (c) => (area === "all" || c.area === area) && (budgetFilter === "all" || c.budgetTier === budgetFilter)
  );

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">クリニック</h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          エリア・予算でクリニックを絞り込めます。
        </p>
      </header>

      <div className="flex items-start gap-1.5 rounded-xl bg-[var(--card)] p-2.5 text-[11px] leading-relaxed text-[var(--foreground-muted)]">
        <Icon name="warning" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        現在表示されているクリニックはすべてサンプル（仮データ）です。実在のクリニックとの提携はまだありません。
      </div>

      <div className="flex flex-col gap-2">
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm"
        >
          <option value="all">エリア：すべて</option>
          {CLINIC_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={budgetFilter === "all"} onClick={() => setBudgetFilter("all")} label="予算：すべて" />
          {BUDGET_ORDER.map((b) => (
            <FilterChip key={b} active={budgetFilter === b} onClick={() => setBudgetFilter(b)} label={BUDGET_LABELS[b]} />
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-center text-sm text-[var(--foreground-muted)]">
          条件に合うクリニックが見つかりませんでした。
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              href={`/clinics/${c.id}`}
              className="block rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-transform active:scale-[0.98]"
            >
              <p className="text-sm font-bold">{c.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                <Icon name="pin" className="h-3.5 w-3.5" />
                {c.area}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.specialties.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] font-semibold text-[var(--foreground-muted)]"
                  >
                    <Icon name={AESTHETIC_CATEGORY_ICON[s]} className="h-3 w-3" />
                    {AESTHETIC_CATEGORY_LABELS[s]}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-[var(--foreground)]">{c.priceRangeText}</p>
            </Link>
          </li>
        ))}
      </ul>
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
