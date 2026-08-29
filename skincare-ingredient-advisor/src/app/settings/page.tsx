const SKIN_TYPES = ["乾燥肌", "脂性肌", "混合肌", "普通肌", "敏感肌"] as const;

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">設定</h1>
        <p className="text-sm text-neutral-500">
          肌質やお気に入りブランドなど、診断に使うプロフィール情報です。
        </p>
      </header>

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

      <section className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-sm font-bold">お気に入りブランド（任意）</h2>
        <input
          type="text"
          placeholder="例：無印良品、キュレル"
          disabled
          className="mt-2 w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </section>

      <p className="text-center text-[11px] text-neutral-400">
        設定内容はすべて端末内に保存され、外部には送信されません。
      </p>
    </div>
  );
}
