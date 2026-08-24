"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/capture", label: "撮影", icon: "📷" },
  { href: "/record", label: "記録", icon: "📝" },
  { href: "/timeline", label: "経過", icon: "📅" },
  { href: "/care", label: "提案", icon: "✨" },
  { href: "/ingredients", label: "成分", icon: "🧪" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-neutral-900/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                  active
                    ? "text-pink-600 dark:text-pink-400"
                    : "text-neutral-500 dark:text-neutral-400"
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
