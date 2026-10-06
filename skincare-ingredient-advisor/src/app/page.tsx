"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDiagnose } from "@/lib/db";
import { todayStr } from "@/lib/date";
import AppBackground, { type AccentTheme } from "@/components/AppBackground";

const ACCENTS: AccentTheme[] = ["mint", "blue", "beige"];

const LINKS = [
  {
    href: "/diagnose",
    icon: "🔍",
    title: "診断する",
    desc: "気になる部位・今日の気温・肌質を入力して診断",
  },
  {
    href: "/result",
    icon: "💡",
    title: "診断結果",
    desc: "不足成分と、朝晩のブランド別おすすめ商品を確認",
  },
  {
    href: "/history",
    icon: "🗂️",
    title: "記録",
    desc: "過去の診断をアーカイブとして振り返る",
  },
  {
    href: "/products",
    icon: "🧴",
    title: "商品データ",
    desc: "成分×ブランド商品の対応表を確認・編集",
  },
  {
    href: "/chat",
    icon: "💬",
    title: "スキンケアパートナー",
    desc: "チャットでスキンケアの相談ができます",
  },
  {
    href: "/settings",
    icon: "⚙️",
    title: "プロフィール",
    desc: "肌質・年齢・お気に入りブランドなどの登録情報",
  },
] as const;

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const requestedAccent = searchParams.get("accent");
  const accent: AccentTheme = (ACCENTS as string[]).includes(requestedAccent ?? "")
    ? (requestedAccent as AccentTheme)
    : "mint";

  const [hasToday, setHasToday] = useState<boolean | null>(null);

  useEffect(() => {
    getDiagnose(todayStr()).then((rec) => {
      setHasToday(!!(rec && (rec.concerns.length > 0 || rec.skinType || rec.temperatureC != null || rec.photo)));
    });
  }, []);

  return (
    <>
      <AppBackground accent={accent} />
      <div data-accent={accent} className="flex flex-col gap-5" style={{ color: "var(--navi-foreground)" }}>
        <header className="pt-1">
          <p className="text-xs font-semibold tracking-[0.2em]" style={{ color: "var(--navi-accent-strong)" }}>
            SKIN NAVI
          </p>
          <h1 className="mt-1.5 text-[26px] font-bold">肌ナビ</h1>
          <p className="mt-2 text-sm leading-relaxed opacity-70">
            写真と気温・肌質から、今足りない成分とブランド商品を提案します。まずは今日の肌を記録してみましょう。
          </p>

          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              backgroundColor: "var(--navi-accent-soft)",
              color: "var(--navi-accent-strong)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: hasToday === true ? "var(--navi-accent)" : "currentColor", opacity: hasToday === true ? 1 : 0.4 }}
            />
            {hasToday === true ? "今日の診断は完了しています" : "今日はまだ診断していません"}
          </div>
        </header>

        <nav className="flex flex-col gap-2.5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navi-card flex items-center gap-3 rounded-2xl p-3.5 shadow-sm backdrop-blur-xl transition-transform active:scale-[0.98]"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: "var(--navi-accent-soft)" }}
              >
                {link.icon}
              </span>
              <span className="min-w-0">
                <p className="font-semibold">{link.title}</p>
                <p className="mt-0.5 truncate text-xs opacity-60">{link.desc}</p>
              </span>
            </Link>
          ))}
        </nav>

        <p className="pt-1 text-center text-[11px] opacity-50">
          データは端末内のIndexedDBにのみ保存され、外部には送信されません。
        </p>
      </div>
    </>
  );
}
