"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { getDiagnose, getProfile, saveProfile } from "@/lib/db";
import { todayStr } from "@/lib/date";
import { BUDGET_ORDER, BUDGET_SHORT_LABELS, type Budget } from "@/lib/types";
import { Icon, type IconName } from "@/components/icons";

const PRIMARY_LINKS: { href: string; icon: IconName; title: string; desc: string }[] = [
  { href: "/diagnose", icon: "camera", title: "診断する", desc: "気になる部位・今日の気温・肌質を入力" },
  { href: "/result", icon: "checkCircle", title: "診断結果", desc: "朝晩のおすすめ商品を確認" },
  { href: "/history", icon: "calendar", title: "記録をふりかえる", desc: "過去の診断をアーカイブで確認" },
];

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const [hasToday, setHasToday] = useState<boolean | null>(null);
  const [budget, setBudget] = useState<Budget | undefined>(undefined);
  const [hasSkinTypeDiagnosis, setHasSkinTypeDiagnosis] = useState<boolean | null>(null);

  useEffect(() => {
    getDiagnose(todayStr()).then((rec) => {
      setHasToday(!!(rec && (rec.concerns.length > 0 || rec.skinType || rec.temperatureC != null || rec.photo)));
    });
    getProfile().then((p) => {
      setBudget(p.budget);
      setHasSkinTypeDiagnosis(!!p.skinTypeDiagnosis);
    });
  }, []);

  async function changeBudget(b: Budget) {
    setBudget(b);
    const existing = await getProfile();
    await saveProfile({ ...existing, id: "default", budget: b });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-1">
        <p className="text-xs font-semibold tracking-[0.15em] text-[var(--foreground-muted)]">SKIN NAVI</p>
        <h1 className="mt-1.5 text-xl font-bold">肌ナビ</h1>

        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: hasToday === true ? "var(--accent)" : "var(--card-border)" }}
          />
          {hasToday === true ? "今日の診断は完了しています" : "今日はまだ診断していません"}
        </div>
      </header>

      {hasSkinTypeDiagnosis === false && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon name="question" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <p className="text-sm font-semibold">自分の肌タイプ、知っていますか？</p>
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              8〜9個の質問に答えるだけで、肌タイプが分かります
            </p>
          </span>
          <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
            <Link
              href="/skin-type"
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)]"
              style={{ backgroundColor: "var(--accent)" }}
            >
              診断する
            </Link>
            <button type="button" onClick={() => setHasSkinTypeDiagnosis(true)} className="text-[11px] text-[var(--foreground-muted)]">
              後で
            </button>
          </div>
        </div>
      )}

      <section>
        <p className="mb-1.5 text-xs font-semibold text-[var(--foreground-muted)]">月の予算</p>
        <div className="grid grid-cols-3 gap-1.5">
          {BUDGET_ORDER.map((b) => {
            const selected = budget === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => changeBudget(b)}
                aria-pressed={selected}
                className="rounded-xl border py-2 text-center text-xs font-semibold transition-colors"
                style={
                  selected
                    ? { backgroundColor: "var(--accent)", color: "var(--accent-contrast)", borderColor: "transparent" }
                    : { backgroundColor: "var(--card)", color: "var(--foreground-muted)", borderColor: "var(--card-border)" }
                }
              >
                {BUDGET_SHORT_LABELS[b]}
              </button>
            );
          })}
        </div>
      </section>

      <nav className="flex flex-col gap-2.5">
        {PRIMARY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 transition-transform active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Icon name={link.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <p className="text-sm font-semibold">{link.title}</p>
              <p className="mt-0.5 truncate text-xs text-[var(--foreground-muted)]">{link.desc}</p>
            </span>
          </Link>
        ))}
      </nav>

      <Link
        href="/chat"
        className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--card-border)] py-2.5 text-xs font-semibold text-[var(--foreground-muted)]"
      >
        <Icon name="chat" className="h-4 w-4" />
        スキンケアパートナーに相談する
      </Link>

      <p className="pt-1 text-center text-[11px] text-[var(--foreground-muted)]">
        データは端末内のIndexedDBにのみ保存され、外部には送信されません。
      </p>
    </div>
  );
}
