"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDiagnose } from "@/lib/db";

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const LINKS = [
  {
    href: "/diagnose",
    title: "🔍 診断する",
    desc: "気になる部位・今日の気温・肌質を入力して診断",
  },
  {
    href: "/result",
    title: "💡 診断結果",
    desc: "不足成分と、朝晩のブランド別おすすめ商品を確認",
  },
  {
    href: "/products",
    title: "🧴 商品データ",
    desc: "成分×ブランド商品の対応表を確認・編集",
  },
  {
    href: "/settings",
    title: "⚙️ 設定",
    desc: "肌質・お気に入りブランドなどのプロフィール",
  },
] as const;

export default function Home() {
  const [hasToday, setHasToday] = useState<boolean | null>(null);

  useEffect(() => {
    getDiagnose(todayStr()).then((rec) => {
      setHasToday(!!(rec && (rec.concerns.length > 0 || rec.skinType || rec.temperatureC != null || rec.photo)));
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <h1 className="text-xl font-bold">成分アドバイザー</h1>
        <p className="mt-1 text-sm text-neutral-500">
          写真と気温・肌質から、今足りない成分とブランド商品を提案します
        </p>
      </header>

      {hasToday === false && (
        <div className="rounded-xl bg-teal-50 p-3 text-sm text-teal-700 dark:bg-teal-950/30 dark:text-teal-300">
          今日はまだ診断していません。診断画面から入力しましょう。
        </div>
      )}
      {hasToday === true && (
        <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
          今日の診断は完了しています。結果画面でおすすめを確認できます。
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
