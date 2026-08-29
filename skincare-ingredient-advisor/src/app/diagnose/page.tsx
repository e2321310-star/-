const CHECK_ITEMS = ["毛穴", "色ムラ", "乾燥/テカリ", "ハリ", "肌荒れ"] as const;
const SKIN_TYPES = ["乾燥肌", "脂性肌", "混合肌", "普通肌", "敏感肌"] as const;

export default function DiagnosePage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">診断</h1>
        <p className="text-sm text-neutral-500">
          写真を撮る（または気になる部位をセルフチェック）+ 今日の気温・肌質を入力します。
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-sm font-bold">写真</h2>
        <div className="mt-2 flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-900">
          撮影機能は今後実装予定
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-sm font-bold">気になる部位（セルフチェック）</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {CHECK_ITEMS.map((item) => (
            <span
              key={item}
              className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-neutral-400">タップで選択できるようになります（今後実装）</p>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-sm font-bold">今日の気温</h2>
        <input
          type="number"
          placeholder="例：28（℃）"
          disabled
          className="mt-2 w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-sm font-bold">肌質</h2>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {SKIN_TYPES.map((type) => (
            <span
              key={type}
              className="rounded-lg bg-neutral-100 py-2 text-center text-xs font-medium text-neutral-400 dark:bg-neutral-900"
            >
              {type}
            </span>
          ))}
        </div>
      </section>

      <button
        disabled
        className="w-full rounded-full bg-teal-600/40 py-3 text-sm font-semibold text-white"
      >
        診断する（準備中）
      </button>
    </div>
  );
}
