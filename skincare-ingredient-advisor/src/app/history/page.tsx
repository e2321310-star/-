"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllDiagnoses } from "@/lib/db";
import { formatDateJa } from "@/lib/date";
import {
  CONCERN_LABELS,
  SKIN_TYPE_LABELS,
  type ConcernKey,
  type DiagnoseRecord,
} from "@/lib/types";
import { CONCERN_BADGE_CLASS, CONCERN_DOT_CLASS } from "@/lib/theme";

export default function HistoryPage() {
  const [records, setRecords] = useState<DiagnoseRecord[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDiagnoses().then((recs) => {
      setRecords(recs);
      const map: Record<string, string> = {};
      for (const r of recs) {
        if (r.photo) map[r.date] = URL.createObjectURL(r.photo);
      }
      setUrls(map);
      setLoading(false);
    });
  }, []);

  const concernTally = tallyConcerns(records);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">記録</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          過去の診断をアーカイブとして振り返れます。
        </p>
      </header>

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading && records.length === 0 && (
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 text-sm text-neutral-500 dark:text-neutral-400">
          まだ記録がありません。診断画面から入力すると、ここに積み重なっていきます。
        </div>
      )}

      {!loading && records.length > 0 && concernTally.length > 0 && (
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-bold">最近よく気になっている部位</h2>
          <div className="flex flex-wrap gap-1.5">
            {concernTally.map(({ concern, count }) => (
              <span
                key={concern}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${CONCERN_BADGE_CLASS[concern]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${CONCERN_DOT_CLASS[concern]}`} />
                {CONCERN_LABELS[concern]} ×{count}
              </span>
            ))}
          </div>
        </section>
      )}

      {!loading && records.length > 0 && (
        <ul className="flex flex-col gap-2.5">
          {records.map((rec) => (
            <li key={rec.date}>
              <Link
                href={`/result?date=${rec.date}`}
                className="flex gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3 shadow-sm transition-transform active:scale-[0.98]"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-white/10">
                  {urls[rec.date] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={urls[rec.date]} alt={rec.date} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{formatDateJa(rec.date)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {rec.skinType && <span>{SKIN_TYPE_LABELS[rec.skinType]}</span>}
                    {rec.temperatureC != null && <span>・{rec.temperatureC}℃</span>}
                  </div>
                  {rec.concerns.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {rec.concerns.map((c) => (
                        <span
                          key={c}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CONCERN_BADGE_CLASS[c]}`}
                        >
                          {CONCERN_LABELS[c]}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-neutral-400">気になる部位の入力なし</p>
                  )}
                  <p className="mt-1.5 text-[11px] font-semibold text-pink-600 dark:text-pink-400">
                    診断結果を見る →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function tallyConcerns(records: DiagnoseRecord[]): { concern: ConcernKey; count: number }[] {
  const counts = new Map<ConcernKey, number>();
  for (const rec of records) {
    for (const c of rec.concerns) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([concern, count]) => ({ concern, count }));
}
