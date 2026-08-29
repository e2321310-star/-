"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/diagnose", label: "診断", icon: "🔍" },
  { href: "/result", label: "結果", icon: "💡" },
  { href: "/products", label: "商品", icon: "🧴" },
  { href: "/settings", label: "設定", icon: "⚙️" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--card-border)] bg-[var(--card)]/90 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-1 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`mx-0.5 flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-teal-600/10 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
