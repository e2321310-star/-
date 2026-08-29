const CATEGORIES = ["化粧水", "美容液", "クリーム", "乳液", "パック"] as const;

export default function ResultPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">診断結果</h1>
        <p className="text-sm text-neutral-500">
          不足していそうな成分と、朝晩それぞれのブランド別おすすめ商品を表示します。
        </p>
      </header>

      <div className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-500 dark:bg-neutral-900">
        まだ診断データがありません。診断画面から入力してください。
      </div>

      <section>
        <h2 className="mb-2 text-sm font-bold">不足傾向の成分（例）</h2>
        <div className="flex flex-wrap gap-1.5">
          {["ナイアシンアミド", "セラミド", "ビタミンC誘導体"].map((name) => (
            <span
              key={name}
              className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {(["☀️ 朝のケア", "🌙 夜のケア"] as const).map((title) => (
        <section key={title}>
          <h2 className="mb-2 text-sm font-bold">{title}</h2>
          <ol className="flex flex-col gap-2">
            {CATEGORIES.map((category, i) => (
              <li
                key={category}
                className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold">{category}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  おすすめブランド商品はここに表示されます（今後実装）
                </p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
