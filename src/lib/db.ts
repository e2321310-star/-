import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { DailyRecord, IngredientEntry } from "./types";
import { SEED_INGREDIENTS } from "./seedIngredients";

const DB_NAME = "skincare-db";
const DB_VERSION = 1;

interface SkincareDB extends DBSchema {
  records: {
    key: string; // date "YYYY-MM-DD"
    value: DailyRecord;
    indexes: { "by-date": string };
  };
  ingredients: {
    key: number;
    value: IngredientEntry;
    indexes: { "by-concern": string };
  };
}

let dbPromise: Promise<IDBPDatabase<SkincareDB>> | null = null;

function getDB(): Promise<IDBPDatabase<SkincareDB>> {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<SkincareDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("records")) {
          const store = db.createObjectStore("records", { keyPath: "date" });
          store.createIndex("by-date", "date");
        }
        if (!db.objectStoreNames.contains("ingredients")) {
          const store = db.createObjectStore("ingredients", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-concern", "concern");
        }
      },
    });
  }
  return dbPromise;
}

// ---------- records ----------

export async function getAllRecords(): Promise<DailyRecord[]> {
  const db = await getDB();
  const all = await db.getAll("records");
  return all.sort((a, b) => (a.date < b.date ? 1 : -1)); // 新しい順
}

export async function getRecord(date: string): Promise<DailyRecord | undefined> {
  const db = await getDB();
  return db.get("records", date);
}

export async function saveRecord(record: DailyRecord): Promise<void> {
  const db = await getDB();
  await db.put("records", { ...record, updatedAt: new Date().toISOString() });
}

export async function deleteRecord(date: string): Promise<void> {
  const db = await getDB();
  await db.delete("records", date);
}

// ---------- ingredients ----------

// IndexedDBはストアごとにreadwriteトランザクションを直列化するため、
// 「空か確認してから追加する」処理を同一トランザクション内で行うことで、
// 同時に複数回呼ばれても（React Strict Modeでの二重effect実行など）
// 初期データが重複投入されないようにする。
export async function getAllIngredients(): Promise<IngredientEntry[]> {
  const db = await getDB();
  const tx = db.transaction("ingredients", "readwrite");
  const existing = await tx.store.getAll();
  if (existing.length === 0) {
    for (const entry of SEED_INGREDIENTS) {
      await tx.store.add(entry);
    }
    const seeded = await tx.store.getAll();
    await tx.done;
    return seeded;
  }
  await tx.done;
  return existing;
}

export async function addIngredient(entry: IngredientEntry): Promise<number> {
  const db = await getDB();
  return db.add("ingredients", entry) as Promise<number>;
}

export async function updateIngredient(entry: IngredientEntry): Promise<void> {
  const db = await getDB();
  await db.put("ingredients", entry);
}

export async function deleteIngredient(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("ingredients", id);
}
