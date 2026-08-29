"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/lib/db";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CONCERN_LABELS,
  CONCERN_ORDER,
  PERIOD_LABELS,
  type BrandProduct,
  type CarePeriod,
  type ConcernKey,
  type ProductCategory,
} from "@/lib/types";
import { CONCERN_BADGE_CLASS, CONCERN_DOT_CLASS } from "@/lib/theme";

const PERIOD_ORDER: CarePeriod[] = ["both", "am", "pm"];

const emptyForm = {
  concern: CONCERN_ORDER[0],
  category: CATEGORY_ORDER[0],
  ingredient: "",
  brand: "",
  name: "",
  period: "both" as CarePeriod,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<BrandProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ConcernKey | "all">("all");
  const [showHelp, setShowHelp] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<{
    concern: ConcernKey;
    category: ProductCategory;
    ingredient: string;
    brand: string;
    name: string;
    period: CarePeriod;
  }>(emptyForm);

  function load() {
    getAllProducts().then((list) => {
      setProducts(list);
      setLoading(false);
    });
  }

  useEffect(load, []);

  const grouped = useMemo(() => {
    const map = new Map<ConcernKey, BrandProduct[]>();
    for (const key of CONCERN_ORDER) map.set(key, []);
    for (const p of products) {
      if (filter !== "all" && p.concern !== filter) continue;
      map.get(p.concern)?.push(p);
    }
    return map;
  }, [products, filter]);

  function startAdd() {
    setForm({ ...emptyForm, concern: filter === "all" ? CONCERN_ORDER[0] : filter });
    setEditingId("new");
  }

  function startEdit(p: BrandProduct) {
    setForm({
      concern: p.concern,
      category: p.category,
      ingredient: p.ingredient,
      brand: p.brand,
      name: p.name,
      period: p.period ?? "both",
    });
    setEditingId(p.id ?? "new");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand.trim() || !form.name.trim()) return;
    const payload = {
      concern: form.concern,
      category: form.category,
      ingredient: form.ingredient.trim(),
      brand: form.brand.trim(),
      name: form.name.trim(),
      period: form.period,
    };
    if (editingId === "new") {
      await addProduct(payload);
    } else if (typeof editingId === "number") {
      await updateProduct({ id: editingId, ...payload });
    }
    cancelEdit();
    load();
  }

  async function handleDelete(id?: number) {
    if (id == null) return;
    if (!confirm("この商品データを削除しますか？")) return;
    await deleteProduct(id);
    load();
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">商品データ</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          悩み別の成分と、対応するブランド商品の一覧です。自由に追加・編集・削除できます。
        </p>
      </header>

      <button
        onClick={() => setShowHelp((v) => !v)}
        className="flex items-center justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl px-4 py-2.5 text-left text-xs font-semibold text-neutral-600 shadow-sm dark:text-neutral-300"
      >
        <span>ℹ️ この画面の使い方</span>
        <span className="text-neutral-400">{showHelp ? "閉じる ▲" : "開く ▼"}</span>
      </button>
      {showHelp && (
        <div className="-mt-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 text-xs leading-relaxed text-neutral-600 shadow-sm dark:text-neutral-300">
          <ul className="list-disc space-y-1 pl-4">
            <li>ここは「どの悩みに、どの成分・ブランド商品が対応するか」の対応表です。</li>
            <li>上のチップで悩み別に絞り込んで見られます（すべて/毛穴/色ムラ など）。</li>
            <li>「＋商品を追加」から、自分が知っている商品や気になる商品を自由に追加できます。</li>
            <li>各商品の「編集」「削除」から内容を修正・削除できます。</li>
            <li>
              ここに登録された商品の中から、あなたの診断結果（不足傾向の成分）に合うものが自動的に選ばれて「診断結果」画面に表示されます。商品を増やすほど、提案の幅が広がります。
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="すべて" />
        {CONCERN_ORDER.map((key) => (
          <FilterChip
            key={key}
            active={filter === key}
            onClick={() => setFilter(key)}
            label={CONCERN_LABELS[key]}
            colorClass={CONCERN_BADGE_CLASS[key]}
          />
        ))}
      </div>

      <button
        onClick={startAdd}
        className="w-full rounded-full border border-dashed border-pink-300 py-2.5 text-sm font-semibold text-pink-700 dark:border-pink-800 dark:text-pink-300"
      >
        ＋ 商品を追加
      </button>

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-2xl border border-pink-300 bg-pink-50/60 p-3 shadow-sm dark:border-pink-800 dark:bg-pink-500/10"
        >
          <label className="text-xs font-medium text-neutral-500">
            悩みカテゴリ
            <select
              value={form.concern}
              onChange={(e) => setForm((f) => ({ ...f, concern: e.target.value as ConcernKey }))}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2 py-1.5 text-sm dark:bg-white/5"
            >
              {CONCERN_ORDER.map((key) => (
                <option key={key} value={key}>
                  {CONCERN_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-neutral-500">
            商品カテゴリ
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2 py-1.5 text-sm dark:bg-white/5"
            >
              {CATEGORY_ORDER.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-neutral-500">
            ブランド名
            <input
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              placeholder="例：肌ラボ"
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2 py-1.5 text-sm dark:bg-white/5"
              required
            />
          </label>
          <label className="text-xs font-medium text-neutral-500">
            商品名
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="例：極潤ヒアルロン液"
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2 py-1.5 text-sm dark:bg-white/5"
              required
            />
          </label>
          <label className="text-xs font-medium text-neutral-500">
            成分名（任意）
            <input
              value={form.ingredient}
              onChange={(e) => setForm((f) => ({ ...f, ingredient: e.target.value }))}
              placeholder="例：ヒアルロン酸"
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2 py-1.5 text-sm dark:bg-white/5"
            />
          </label>
          <label className="text-xs font-medium text-neutral-500">
            朝晩どちらで使う成分か
            <select
              value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value as CarePeriod }))}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-2 py-1.5 text-sm dark:bg-white/5"
            >
              {PERIOD_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PERIOD_LABELS[p]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-2 text-sm font-semibold text-white"
            >
              {editingId === "new" ? "追加する" : "更新する"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex-1 rounded-full border border-neutral-300 py-2 text-sm font-medium dark:border-neutral-700"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-neutral-400">読み込み中…</p>}

      {!loading &&
        Array.from(grouped.entries())
          .filter(([, list]) => list.length > 0)
          .map(([concern, list]) => (
            <section key={concern}>
              <h2 className="mb-1.5 flex items-center gap-1.5 text-sm font-bold">
                <span className={`h-2 w-2 rounded-full ${CONCERN_DOT_CLASS[concern]}`} />
                {CONCERN_LABELS[concern]}
              </h2>
              <ul className="flex flex-col gap-2">
                {list.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">
                          {p.brand} <span className="font-normal">{p.name}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-400">
                          {CATEGORY_LABELS[p.category]}
                          {p.ingredient ? ` ・ ${p.ingredient}` : ""}
                        </p>
                        {p.period && p.period !== "both" && (
                          <span className="mt-1 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                            {PERIOD_LABELS[p.period]}
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2 text-xs">
                        <button onClick={() => startEdit(p)} className="text-neutral-500 underline">
                          編集
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 underline">
                          削除
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  colorClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  colorClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? colorClass ?? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
