"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/db";

const TAB_ITEMS = [
  { href: "/", label: "記録", icon: "🗂️" },
  { href: "/products", label: "おすすめ商品", icon: "🧴" },
  { href: "/aesthetic", label: "整形・美容医療", icon: "✨" },
  { href: "/clinics", label: "クリニック", icon: "🏥" },
  { href: "/settings", label: "マイページ", icon: "⚙️" },
] as const;

// 画面上部に固定するタブバー。初回起動時はプロフィール未設定（onboardingCompleted未完了）なら
// /onboarding へ誘導し、タブ自体も表示しない（ウィザードに専念させるため）。
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isOnboarding = pathname === "/onboarding";

  useEffect(() => {
    if (isOnboarding) return;
    getProfile().then((p) => {
      if (!p.onboardingCompleted) {
        router.replace("/onboarding");
      } else {
        setReady(true);
      }
    });
  }, [isOnboarding, router]);

  if (isOnboarding) {
    return <>{children}</>;
  }

  if (!ready) {
    return null;
  }

  return (
    <>
      <nav
        className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-1 py-1.5">
          {TAB_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`mx-0.5 flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-center text-[9px] font-semibold leading-tight transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-md shadow-pink-900/25"
                      : "text-neutral-400 active:scale-95 dark:text-neutral-500"
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {children}
    </>
  );
}
