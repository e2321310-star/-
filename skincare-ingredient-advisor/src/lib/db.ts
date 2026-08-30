import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { BrandProduct, DiagnoseRecord, Profile } from "./types";
import { SEED_PRODUCTS } from "@/data/seedProducts";

const DB_NAME = "skincare-ingredient-advisor-db";
const DB_VERSION = 1;

interface AppDB extends DBSchema {
  diagnoses: {
    key: string; // date "YYYY-MM-DD"
    value: DiagnoseRecord;
  };
  products: {
    key: number;
    value: BrandProduct;
    indexes: { "by-concern": string };
  };
  profile: {
    key: string; // "default"
    value: Profile;
  };
}

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null;

function getDB(): Promise<IDBPDatabase<AppDB>> {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("diagnoses")) {
          db.createObjectStore("diagnoses", { keyPath: "date" });
        }
        if (!db.objectStoreNames.contains("products")) {
          const store = db.createObjectStore("products", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-concern", "concern");
        }
        if (!db.objectStoreNames.contains("profile")) {
          db.createObjectStore("profile", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

// ---------- diagnoses ----------

export async function getAllDiagnoses(): Promise<DiagnoseRecord[]> {
  const db = await getDB();
  const all = await db.getAll("diagnoses");
  return all.sort((a, b) => (a.date < b.date ? 1 : -1)); // 新しい順
}

export async function getDiagnose(date: string): Promise<DiagnoseRecord | undefined> {
  const db = await getDB();
  return db.get("diagnoses", date);
}

export async function saveDiagnose(record: DiagnoseRecord): Promise<void> {
  const db = await getDB();
  await db.put("diagnoses", { ...record, updatedAt: new Date().toISOString() });
}

// ---------- products ----------

// 悩み・カテゴリ・使用タイミングが一致するかで、同じ「枠」の商品かどうかを判定する
// （アプリ更新でブランド名・商品名・価格などが変わっても、同じ枠として追従させるため）
function sameSlot(a: BrandProduct, b: BrandProduct): boolean {
  return a.concern === b.concern && a.category === b.category && (a.period ?? "both") === (b.period ?? "both");
}

// 「空か確認してから追加する」を同一トランザクション内で行い、
// 複数回呼ばれても（React Strict Modeの二重effectなど）初期データが重複投入されないようにする。
// また、まだ自分で価格・購入リンクを入力していない項目については、アプリ側の最新の
// 初期データ（価格・リンクが確認できたもの）で自動的に補完する。自分で編集した項目は上書きしない。
export async function getAllProducts(): Promise<BrandProduct[]> {
  const db = await getDB();
  const tx = db.transaction("products", "readwrite");
  const existing = await tx.store.getAll();
  if (existing.length === 0) {
    for (const entry of SEED_PRODUCTS) {
      await tx.store.add(entry);
    }
    const seeded = await tx.store.getAll();
    await tx.done;
    return seeded;
  }

  let changed = false;
  for (const seed of SEED_PRODUCTS) {
    const match = existing.find((p) => sameSlot(p, seed));
    if (!match) {
      await tx.store.add(seed);
      changed = true;
      continue;
    }
    const untouched = !match.price && !match.link;
    const seedHasNewInfo = match.brand !== seed.brand || match.name !== seed.name || seed.price || seed.link;
    if (untouched && seedHasNewInfo) {
      await tx.store.put({ ...seed, id: match.id });
      changed = true;
    }
  }
  const result = changed ? await tx.store.getAll() : existing;
  await tx.done;
  return result;
}

export async function addProduct(entry: BrandProduct): Promise<number> {
  const db = await getDB();
  return db.add("products", entry) as Promise<number>;
}

export async function updateProduct(entry: BrandProduct): Promise<void> {
  const db = await getDB();
  await db.put("products", entry);
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("products", id);
}

// ---------- profile ----------

export async function getProfile(): Promise<Profile> {
  const db = await getDB();
  const profile = await db.get("profile", "default");
  return profile ?? { id: "default" };
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await getDB();
  await db.put("profile", profile);
}
