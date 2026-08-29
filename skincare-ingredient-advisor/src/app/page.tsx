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
    icon: "🔍",
    ring: "bg-teal-100 dark:bg-teal-950/60",
    title: "診断する",
    desc: "気になる部位・今日の気温・肌質を入力して診断",
  },
  {
    href: "/result",
    icon: "💡",
    ring: "bg-amber-100 dark:bg-amber-950/60",
    title: "診断結果",
    desc: "不足成分と、朝晩のブランド別おすすめ商品を確認",
  },
  {
    href: "/products",
    icon: "🧴",
    ring: "bg-rose-100 dark:bg-rose-950/60",
    title: "商品データ",
    desc: "成分×ブランド商品の対応表を確認・編集",
  },
  {
    href: "/settings",
    icon: "⚙️",
    ring: "bg-violet-100 dark:bg-violet-950/60",
    title: "設定",
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
    <div className="flex flex-col gap-5">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 px-5 py-6 text-white shadow-lg shadow-teal-900/10">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-white/10" />
        <p className="text-xs font-medium tracking-wide text-teal-50/90">SKIN INGREDIENT ADVISOR</p>
        <h1 className="mt-1 text-2xl font-bold">成分アドバイザー</h1>
        <p className="mt-2 text-sm leading-relaxed text-teal-50/95">
          写真と気温・肌質から、今足りない成分とブランド商品を提案します
        </p>

        <div
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            hasToday === true
              ? "bg-white/90 text-teal-700"
              : "bg-black/15 text-white"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${hasToday === true ? "bg-teal-500" : "bg-white/70"}`} />
          {hasToday === true ? "今日の診断は完了しています" : "今日はまだ診断していません"}
        </div>
      </header>

      <nav className="flex flex-col gap-2.5">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 shadow-sm transition-transform active:scale-[0.98]"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${link.ring}`}>
              {link.icon}
            </span>
            <span className="min-w-0">
              <p className="font-semibold">{link.title}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">{link.desc}</p>
            </span>
          </Link>
        ))}
      </nav>

      <p className="pt-1 text-center text-[11px] text-neutral-400">
        データは端末内のIndexedDBにのみ保存され、外部には送信されません。
      </p>
    </div>
  );
}
