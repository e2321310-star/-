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
      className="fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-md rounded-[28px] border border-[var(--card-border)] bg-[var(--card)] shadow-xl shadow-pink-900/10 backdrop-blur-xl"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-between px-1.5 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`mx-0.5 flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-md shadow-pink-900/20"
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
