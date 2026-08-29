"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/db";
import { SKIN_TYPE_LABELS, SKIN_TYPE_ORDER, type SkinType } from "@/lib/types";

export default function SettingsPage() {
  const [skinType, setSkinType] = useState<SkinType | undefined>(undefined);
  const [favoriteBrands, setFavoriteBrands] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((p) => {
      setSkinType(p.skinType);
      setFavoriteBrands(p.favoriteBrands ?? "");
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    await saveProfile({ id: "default", skinType, favoriteBrands: favoriteBrands.trim() });
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">設定</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          肌質やお気に入りブランドなど、診断に使うプロフィール情報です。
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-400">読み込み中…</p>
      ) : (
        <>
          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm">
            <h2 className="text-sm font-bold">肌質</h2>
            <p className="mt-1 text-xs text-neutral-400">
              診断画面での初期値として使われます（診断のたびに変更もできます）
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {SKIN_TYPE_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSkinType(type)}
                  aria-pressed={skinType === type}
                  className={`rounded-lg py-2 text-center text-xs font-semibold transition-colors ${
                    skinType === type
                      ? "bg-teal-600 text-white shadow-sm shadow-teal-900/20"
                      : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                  }`}
                >
                  {SKIN_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm">
            <h2 className="text-sm font-bold">お気に入りブランド（任意）</h2>
            <input
              type="text"
              value={favoriteBrands}
              onChange={(e) => setFavoriteBrands(e.target.value)}
              placeholder="例：無印良品、キュレル"
              className="mt-2 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-3 py-2 text-sm dark:bg-white/5"
            />
          </section>

          <button
            onClick={handleSave}
            className="w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/15"
          >
            保存する
          </button>

          {saved && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
              保存しました。
            </div>
          )}
        </>
      )}

      <p className="text-center text-[11px] text-neutral-400">
        設定内容はすべて端末内に保存され、外部には送信されません。
      </p>
    </div>
  );
}
