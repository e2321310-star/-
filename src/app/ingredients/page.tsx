"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addIngredient,
  deleteIngredient,
  getAllIngredients,
  updateIngredient,
} from "@/lib/db";
import { CONCERN_LABELS, type ConcernKey, type IngredientEntry } from "@/lib/types";

const CONCERN_KEYS = Object.keys(CONCERN_LABELS) as ConcernKey[];

const emptyForm = { concern: CONCERN_KEYS[0], name: "", description: "" };

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ConcernKey | "all">("all");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<{ concern: ConcernKey; name: string; description: string }>(
    emptyForm
  );

  function load() {
    getAllIngredients().then((list) => {
      setIngredients(list);
      setLoading(false);
    });
  }

  useEffect(load, []);

  const grouped = useMemo(() => {
    const map = new Map<ConcernKey, IngredientEntry[]>();
    for (const key of CONCERN_KEYS) map.set(key, []);
    for (const ing of ingredients) {
      if (filter !== "all" && ing.concern !== filter) continue;
      map.get(ing.concern)?.push(ing);
    }
    return map;
  }, [ingredients, filter]);

  function startAdd() {
    setForm({ ...emptyForm, concern: filter === "all" ? CONCERN_KEYS[0] : filter });
    setEditingId("new");
  }

  function startEdit(ing: IngredientEntry) {
    setForm({ concern: ing.concern, name: ing.name, description: ing.description });
    setEditingId(ing.id ?? "new");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId === "new") {
      await addIngredient({ concern: form.concern, name: form.name.trim(), description: form.description.trim() });
    } else if (typeof editingId === "number") {
      await updateIngredient({ id: editingId, concern: form.concern, name: form.name.trim(), description: form.description.trim() });
    }
    cancelEdit();
    load();
  }

  async function handleDelete(id?: number) {
    if (id == null) return;
    if (!confirm("この成分を削除しますか？")) return;
    await deleteIngredient(id);
    load();
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">成分データ</h1>
        <p className="text-sm text-neutral-500">
          悩み別の有効成分一覧です。自由に追加・編集・削除できます。
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="すべて" />
        {CONCERN_KEYS.map((key) => (
          <FilterChip
            key={key}
            active={filter === key}
            onClick={() => setFilter(key)}
            label={CONCERN_LABELS[key]}
          />
        ))}
      </div>

      <button
        onClick={startAdd}
        className="w-full rounded-full border border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
      >
        ＋ 成分を追加
      </button>

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-xl border border-pink-300 bg-pink-50/50 p-3 dark:border-pink-900 dark:bg-pink-950/20"
        >
          <label className="text-xs font-medium text-neutral-500">
            悩みカテゴリ
            <select
              value={form.concern}
              onChange={(e) => setForm((f) => ({ ...f, concern: e.target.value as ConcernKey }))}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {CONCERN_KEYS.map((key) => (
                <option key={key} value={key}>
                  {CONCERN_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-neutral-500">
            成分名
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="例：ナイアシンアミド"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </label>
          <label className="text-xs font-medium text-neutral-500">
            説明
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="どんな働きがあるか"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-full bg-pink-600 py-2 text-sm font-semibold text-white"
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
              <h2 className="mb-1.5 text-sm font-bold">{CONCERN_LABELS[concern]}</h2>
              <ul className="flex flex-col gap-2">
                {list.map((ing) => (
                  <li
                    key={ing.id}
                    className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{ing.name}</p>
                      <div className="flex shrink-0 gap-2 text-xs">
                        <button onClick={() => startEdit(ing)} className="text-neutral-500 underline">
                          編集
                        </button>
                        <button onClick={() => handleDelete(ing.id)} className="text-red-500 underline">
                          削除
                        </button>
                      </div>
                    </div>
                    {ing.description && (
                      <p className="mt-1 text-xs text-neutral-500">{ing.description}</p>
                    )}
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
