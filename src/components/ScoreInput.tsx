"use client";

import type { ScoreValue } from "@/lib/types";

const SCALE: ScoreValue[] = [1, 2, 3, 4, 5];

export default function ScoreInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: ScoreValue;
  onChange: (v: ScoreValue) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-neutral-400">{hint}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-5 gap-1.5">
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
              value === n
                ? "bg-pink-600 text-white"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
        <span>気になる</span>
        <span>良好</span>
      </div>
    </div>
  );
}
