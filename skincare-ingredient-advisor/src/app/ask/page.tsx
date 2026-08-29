"use client";

import { useMemo, useState } from "react";
import { SEED_FAQ, type FaqCategory } from "@/data/seedFaq";
import { CONCERN_LABELS, CONCERN_ORDER } from "@/lib/types";
import { CONCERN_BADGE_CLASS, CONCERN_DOT_CLASS } from "@/lib/theme";

const CATEGORY_LABELS_WITH_GENERAL: Record<FaqCategory, string> = {
  general: "基礎知識",
  ...CONCERN_LABELS,
};

const CATEGORY_ORDER_WITH_GENERAL: FaqCategory[] = ["general", ...CONCERN_ORDER];

export default function AskPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<FaqCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return SEED_FAQ.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (!kw) return true;
      const haystack = [entry.question, entry.answer, ...entry.keywords].join(" ").toLowerCase();
      return haystack.includes(kw);
    });
  }, [keyword, category]);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">スキンケア相談室</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          成分・使い方などの「よくある疑問」をQ&A形式で調べられます。
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        一般的に知られている化粧品成分・スキンケアの知見をもとにした参考情報です。特定の専門家個人の見解ではありません。症状が続く・強い場合は自己判断せず皮膚科を受診してください。
      </div>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="キーワードで検索（例：ビタミンC、毛穴、順番）"
        className="rounded-xl border border-[var(--card-border)] bg-neutral-50 px-3 py-2 text-sm dark:bg-white/5"
      />

      <div className="flex flex-wrap gap-1.5">
        <CategoryChip active={category === "all"} onClick={() => setCategory("all")} label="すべて" />
        {CATEGORY_ORDER_WITH_GENERAL.map((c) => (
          <CategoryChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={CATEGORY_LABELS_WITH_GENERAL[c]}
            colorClass={c === "general" ? undefined : CONCERN_BADGE_CLASS[c]}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 text-sm text-neutral-500 dark:text-neutral-400">
          該当する質問が見つかりませんでした。別のキーワードで試してみてください。
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {filtered.map((entry) => {
          const open = openId === entry.id;
          return (
            <li
              key={entry.id}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl shadow-sm"
            >
              <button
                onClick={() => setOpenId(open ? null : entry.id)}
                className="flex w-full items-start justify-between gap-2 p-3.5 text-left"
              >
                <span className="flex items-start gap-2">
                  {entry.category !== "general" && (
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${CONCERN_DOT_CLASS[entry.category]}`} />
                  )}
                  <span className="text-sm font-semibold">Q. {entry.question}</span>
                </span>
                <span className="shrink-0 text-neutral-400">{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <p className="border-t border-[var(--card-border)] px-3.5 py-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  A. {entry.answer}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  colorClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  colorClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? colorClass ?? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
