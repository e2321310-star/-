"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/db";
import { Icon, type IconName } from "@/components/icons";

const TAB_ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "記録", icon: "record" },
  { href: "/products", label: "おすすめ商品", icon: "bottle" },
  { href: "/aesthetic", label: "整形・美容医療", icon: "sparkle" },
  { href: "/clinics", label: "クリニック", icon: "clinic" },
  { href: "/settings", label: "マイページ", icon: "gear" },
];

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
        className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--background)]"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-1 py-1.5">
          {TAB_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className="mx-0.5 flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-center text-[9px] font-semibold leading-tight transition-colors"
                  style={{
                    backgroundColor: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--accent-contrast)" : "var(--foreground-muted)",
                  }}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
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
