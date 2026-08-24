"use client";

import { useEffect, useState } from "react";
import ScoreInput from "@/components/ScoreInput";
import { getRecord, saveRecord } from "@/lib/db";
import { formatDateJa, todayStr } from "@/lib/date";
import {
  SCORE_LABELS,
  SCORE_ORDER,
  type DryOilDirection,
  type ScoreKey,
  type ScoreValue,
  type Scores,
} from "@/lib/types";

const DEFAULT_SCORES: Scores = {
  pores: 3,
  unevenness: 3,
  dryOil: 3,
  firmness: 3,
  roughness: 3,
  dryOilDirection: "balanced",
};

const HINTS: Record<ScoreKey, string> = {
  pores: "毛穴の開き・詰まりが目立たないか",
  unevenness: "透明感があり色ムラが少ないか",
  dryOil: "乾燥もテカリもなくちょうど良いか",
  firmness: "触れたときにハリを感じるか",
  roughness: "ニキビ・赤み・かゆみなどがないか",
};

export default function RecordPage() {
  const [date, setDate] = useState(todayStr());
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasRecord, setHasRecord] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedDate, setSavedDate] = useState<string | null>(null);
  const saved = savedDate === date;

  useEffect(() => {
    let cancelled = false;
    getRecord(date).then((rec) => {
      if (cancelled) return;
      setScores(rec?.scores ?? DEFAULT_SCORES);
      setHasRecord(!!rec);
      setPhotoUrl(rec?.photo ? URL.createObjectURL(rec.photo) : null);
    });
    return () => {
      cancelled = true;
    };
  }, [date]);

  function updateScore(key: ScoreKey, value: ScoreValue) {
    setScores((s) => ({ ...s, [key]: value }));
  }

  function updateDirection(dir: DryOilDirection) {
    setScores((s) => ({ ...s, dryOilDirection: dir }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const existing = await getRecord(date);
      await saveRecord({
        date,
        photo: existing?.photo,
        photoTakenAt: existing?.photoTakenAt,
        memo: existing?.memo,
        scores,
        updatedAt: new Date().toISOString(),
      });
      setHasRecord(true);
      setSavedDate(date);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">記録</h1>
        <p className="text-sm text-neutral-500">
          今日の肌状態を5項目・5段階で自己評価してください。
        </p>
      </header>

      <div>
        <label className="text-xs font-medium text-neutral-500" htmlFor="record-date">
          対象日
        </label>
        <input
          id="record-date"
          type="date"
          value={date}
          max={todayStr()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <p className="mt-1 text-xs text-neutral-400">{formatDateJa(date)}</p>
      </div>

      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={`${date}の記録写真`}
          className="h-40 w-full rounded-xl object-cover"
        />
      )}
      {!photoUrl && (
        <p className="rounded-lg bg-neutral-100 p-3 text-xs text-neutral-500 dark:bg-neutral-900">
          この日の写真はまだありません。撮影画面から追加できます。
        </p>
      )}

      <div className="flex flex-col gap-5 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        {SCORE_ORDER.map((key) => (
          <ScoreInput
            key={key}
            label={SCORE_LABELS[key]}
            hint={HINTS[key]}
            value={scores[key]}
            onChange={(v) => updateScore(key, v)}
          />
        ))}

        {scores.dryOil <= 3 && (
          <div>
            <span className="text-xs font-medium text-neutral-500">
              乾燥/テカリの傾向（低評価時のみ）
            </span>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {(
                [
                  { key: "dry", label: "乾燥寄り" },
                  { key: "balanced", label: "どちらでもない" },
                  { key: "oily", label: "テカリ寄り" },
                ] as { key: DryOilDirection; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => updateDirection(opt.key)}
                  aria-pressed={scores.dryOilDirection === opt.key}
                  className={`rounded-lg py-2 text-xs font-medium ${
                    scores.dryOilDirection === opt.key
                      ? "bg-pink-600 text-white"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-full bg-neutral-900 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
      >
        {saving ? "保存中…" : hasRecord ? "評価を更新する" : "評価を保存する"}
      </button>

      {saved && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          保存しました。
        </div>
      )}
    </div>
  );
}
