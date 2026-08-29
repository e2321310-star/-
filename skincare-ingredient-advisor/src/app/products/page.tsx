const CONCERNS = ["毛穴", "美白・色ムラ", "乾燥", "皮脂・テカリ", "ハリ・エイジング", "肌荒れ・鎮静"] as const;

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">商品データ</h1>
        <p className="text-sm text-neutral-500">
          悩み別の成分と、対応するブランド商品の一覧です。自由に追加・編集できるようにする予定です。
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-neutral-900">
          すべて
        </span>
        {CONCERNS.map((c) => (
          <span
            key={c}
            className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
          >
            {c}
          </span>
        ))}
      </div>

      <button
        disabled
        className="w-full rounded-full border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-400 dark:border-neutral-700"
      >
        ＋ 商品を追加（準備中）
      </button>

      <section>
        <h2 className="mb-1.5 text-sm font-bold">乾燥</h2>
        <ul className="flex flex-col gap-2">
          {[
            { ingredient: "セラミド", brand: "（ブランド名）", product: "（商品名）" },
            { ingredient: "ヒアルロン酸", brand: "（ブランド名）", product: "（商品名）" },
          ].map((item) => (
            <li
              key={item.ingredient}
              className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <p className="text-sm font-semibold">{item.ingredient}</p>
              <p className="mt-1 text-xs text-neutral-400">
                {item.brand} / {item.product}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
