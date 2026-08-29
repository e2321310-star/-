import Link from "next/link";

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
  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <h1 className="text-xl font-bold">成分アドバイザー</h1>
        <p className="mt-1 text-sm text-neutral-500">
          写真と気温・肌質から、今足りない成分とブランド商品を提案します
        </p>
      </header>

      <div className="rounded-xl bg-teal-50 p-3 text-sm text-teal-700 dark:bg-teal-950/30 dark:text-teal-300">
        まだ画面の骨格のみです。診断ロジック・商品データは今後追加していきます。
      </div>

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
    </div>
  );
}
