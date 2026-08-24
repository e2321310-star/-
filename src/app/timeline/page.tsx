"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllRecords } from "@/lib/db";
import { formatDateJa, toDateStr } from "@/lib/date";
import { SCORE_LABELS, SCORE_ORDER, type DailyRecord } from "@/lib/types";

function overallAverage(rec: DailyRecord): number | null {
  if (!rec.scores) return null;
  const vals = SCORE_ORDER.map((k) => rec.scores![k]);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export default function TimelinePage() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selected, setSelected] = useState<string[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // month: 0-11
  });

  useEffect(() => {
    getAllRecords().then((recs) => {
      setRecords(recs);
      setLoading(false);
      const map: Record<string, string> = {};
      for (const r of recs) {
        if (r.photo) map[r.date] = URL.createObjectURL(r.photo);
      }
      setUrls(map);
    });
  }, []);

  const recordsByDate = useMemo(() => {
    const m = new Map<string, DailyRecord>();
    for (const r of records) m.set(r.date, r);
    return m;
  }, [records]);

  function toggleSelect(date: string) {
    if (!recordsByDate.get(date)?.photo) return;
    setSelected((prev) => {
      if (prev.includes(date)) return prev.filter((d) => d !== date);
      if (prev.length >= 2) return [prev[1], date];
      return [...prev, date];
    });
  }

  const compareRecords = selected
    .map((d) => recordsByDate.get(d))
    .filter((r): r is DailyRecord => !!r)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">経過（タイムライン）</h1>
        <p className="text-sm text-neutral-500">
          写真をタップして2件選ぶと比較できます。
        </p>
      </header>

      <div className="flex gap-2">
        <button
          onClick={() => setView("list")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            view === "list"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          一覧
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            view === "calendar"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          カレンダー
        </button>
      </div>

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading && records.length === 0 && (
        <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-500 dark:bg-neutral-900">
          まだ記録がありません。撮影・記録画面から今日の肌状態を残しましょう。
        </p>
      )}

      {!loading && view === "list" && records.length > 0 && (
        <ul className="flex flex-col gap-2">
          {records.map((rec) => {
            const avg = overallAverage(rec);
            const isSelected = selected.includes(rec.date);
            return (
              <li key={rec.date}>
                <button
                  onClick={() => toggleSelect(rec.date)}
                  disabled={!rec.photo}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left disabled:opacity-60 ${
                    isSelected
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30"
                      : "border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                    {urls[rec.date] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={urls[rec.date]} alt={rec.date} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{formatDateJa(rec.date)}</p>
                    {avg !== null ? (
                      <p className="text-xs text-neutral-500">総合評価 {avg.toFixed(1)} / 5</p>
                    ) : (
                      <p className="text-xs text-neutral-400">評価未入力</p>
                    )}
                    {rec.memo && (
                      <p className="truncate text-xs text-neutral-400">{rec.memo}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && view === "calendar" && (
        <CalendarView
          year={cursor.year}
          month={cursor.month}
          recordsByDate={recordsByDate}
          urls={urls}
          selected={selected}
          onSelect={toggleSelect}
          onPrev={() =>
            setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))
          }
          onNext={() =>
            setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))
          }
        />
      )}

      {compareRecords.length === 2 && (
        <CompareView records={compareRecords} urls={urls} />
      )}
    </div>
  );
}

function CalendarView({
  year,
  month,
  recordsByDate,
  urls,
  selected,
  onSelect,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  recordsByDate: Map<string, DailyRecord>;
  urls: Record<string, string>;
  selected: string[];
  onSelect: (date: string) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateStr(new Date(year, month, i + 1))),
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 p-3 dark:border-neutral-800">
      <div className="mb-2 flex items-center justify-between">
        <button onClick={onPrev} className="px-2 py-1 text-sm text-neutral-500">
          ◀
        </button>
        <p className="text-sm font-semibold">
          {year}年{month + 1}月
        </p>
        <button onClick={onNext} className="px-2 py-1 text-sm text-neutral-500">
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-neutral-400">
        {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const rec = recordsByDate.get(date);
          const isSelected = selected.includes(date);
          const day = Number(date.split("-")[2]);
          return (
            <button
              key={date}
              onClick={() => onSelect(date)}
              disabled={!rec?.photo}
              className={`aspect-square overflow-hidden rounded-md border text-[10px] disabled:opacity-40 ${
                isSelected ? "border-pink-500" : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              {rec?.photo && urls[date] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urls[date]} alt={date} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-neutral-400">
                  {day}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompareView({
  records,
  urls,
}: {
  records: DailyRecord[];
  urls: Record<string, string>;
}) {
  const [a, b] = records;
  return (
    <div className="rounded-2xl border border-pink-300 bg-pink-50/50 p-3 dark:border-pink-900 dark:bg-pink-950/20">
      <p className="mb-2 text-sm font-semibold">比較</p>
      <div className="grid grid-cols-2 gap-2">
        {[a, b].map((rec) => (
          <div key={rec.date}>
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
              {urls[rec.date] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urls[rec.date]} alt={rec.date} className="h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-1 text-center text-xs text-neutral-500">{formatDateJa(rec.date)}</p>
          </div>
        ))}
      </div>

      {a.scores && b.scores && (
        <table className="mt-3 w-full text-xs">
          <tbody>
            {SCORE_ORDER.map((key) => {
              const va = a.scores![key];
              const vb = b.scores![key];
              const diff = vb - va;
              return (
                <tr key={key} className="border-t border-pink-200 dark:border-pink-900">
                  <td className="py-1 pr-2 text-neutral-500">{SCORE_LABELS[key]}</td>
                  <td className="py-1 text-center font-medium">{va}</td>
                  <td className="py-1 text-center text-neutral-400">→</td>
                  <td className="py-1 text-center font-medium">{vb}</td>
                  <td
                    className={`py-1 pl-2 text-right font-semibold ${
                      diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-neutral-400"
                    }`}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
