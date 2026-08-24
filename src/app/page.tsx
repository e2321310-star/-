"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecord } from "@/lib/db";
import { formatDateJa, todayStr } from "@/lib/date";

const LINKS = [
  { href: "/capture", title: "📷 撮影", desc: "顔位置ガイド付きカメラで今日の写真を記録" },
  { href: "/record", title: "📝 記録", desc: "毛穴・色ムラなど5項目を5段階で自己評価" },
  { href: "/timeline", title: "📅 経過", desc: "過去の写真・評価を一覧やカレンダーで振り返り、比較" },
  { href: "/care", title: "✨ 今日のケア提案", desc: "評価から不足成分と朝晩のケア工程を提案" },
  { href: "/ingredients", title: "🧪 成分データ", desc: "悩み別の有効成分一覧を確認・編集" },
] as const;

export default function Home() {
  const [hasToday, setHasToday] = useState<boolean | null>(null);

  useEffect(() => {
    getRecord(todayStr()).then((rec) => {
      setHasToday(!!(rec?.photo && rec?.scores));
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <h1 className="text-xl font-bold">スキンケア記録</h1>
        <p className="mt-1 text-sm text-neutral-500">{formatDateJa(todayStr())}</p>
      </header>

      {hasToday === false && (
        <div className="rounded-xl bg-pink-50 p-3 text-sm text-pink-700 dark:bg-pink-950/30 dark:text-pink-300">
          今日はまだ記録がありません。撮影・評価を済ませましょう。
        </div>
      )}
      {hasToday === true && (
        <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
          今日の記録は完了しています。おつかれさまです。
        </div>
      )}

      <nav className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-neutral-200 p-4 transition-colors active:bg-neutral-100 dark:border-neutral-800 dark:active:bg-neutral-900"
          >
            <p className="font-semibold">{link.title}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{link.desc}</p>
          </Link>
        ))}
      </nav>

      <p className="pt-2 text-center text-[11px] text-neutral-400">
        データは端末内のIndexedDBにのみ保存され、外部には送信されません。
      </p>
    </div>
  );
}
