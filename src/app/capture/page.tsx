"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getRecord, saveRecord } from "@/lib/db";
import { todayStr, formatDateJa } from "@/lib/date";

export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [date, setDate] = useState(todayStr());
  const [memo, setMemo] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  // 撮影した写真は、それがどの日付向けかを一緒に持たせておき、
  // 日付を切り替えたら（effectでリセットせず）自動的に無効化する
  const [capture, setCapture] = useState<{ date: string; blob: Blob; url: string } | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedDate, setSavedDate] = useState<string | null>(null);

  const capturedForThisDate = capture?.date === date ? capture : null;
  const saved = savedDate === date;

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (!cancelled) {
          setCameraError(
            "カメラを起動できませんでした。ブラウザのカメラ権限を許可してください。"
          );
        }
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 選択した日付の既存記録を読み込み（上書き確認用にプレビュー表示）
  useEffect(() => {
    let cancelled = false;
    getRecord(date).then((rec) => {
      if (cancelled) return;
      setExistingPhotoUrl(rec?.photo ? URL.createObjectURL(rec.photo) : null);
      setMemo(rec?.memo ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, [date]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // 前面カメラは鏡像で表示しているため、保存画像も見た目に合わせて反転させる
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapture({ date, blob, url: URL.createObjectURL(blob) });
      },
      "image/jpeg",
      0.92
    );
  }

  function handleRetake() {
    setCapture(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const existing = await getRecord(date);
      await saveRecord({
        date,
        photo: capturedForThisDate?.blob ?? existing?.photo,
        photoTakenAt: capturedForThisDate ? new Date().toISOString() : existing?.photoTakenAt,
        memo,
        scores: existing?.scores,
        updatedAt: new Date().toISOString(),
      });
      setSavedDate(date);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">撮影</h1>
        <p className="text-sm text-neutral-500">
          ガイド枠に顔を合わせて撮影してください。毎日同じ位置・明るさで撮ると比較しやすくなります。
        </p>
      </header>

      <div>
        <label className="text-xs font-medium text-neutral-500" htmlFor="capture-date">
          記録日
        </label>
        <input
          id="capture-date"
          type="date"
          value={date}
          max={todayStr()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <p className="mt-1 text-xs text-neutral-400">{formatDateJa(date)}</p>
      </div>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black">
        {!capturedForThisDate && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full scale-x-[-1] object-cover"
          />
        )}
        {capturedForThisDate && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedForThisDate.url}
            alt="撮影プレビュー"
            className="h-full w-full object-cover"
          />
        )}
        {!capturedForThisDate && !cameraError && <FaceGuide />}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white">
            {cameraError}
          </div>
        )}
      </div>

      {!capturedForThisDate && !cameraError && (
        <button
          onClick={handleCapture}
          className="w-full rounded-full bg-pink-600 py-3 text-sm font-semibold text-white active:bg-pink-700"
        >
          撮影する
        </button>
      )}
      {capturedForThisDate && (
        <button
          onClick={handleRetake}
          className="w-full rounded-full border border-neutral-300 py-3 text-sm font-semibold dark:border-neutral-700"
        >
          撮り直す
        </button>
      )}

      {!capturedForThisDate && existingPhotoUrl && (
        <p className="text-xs text-neutral-400">
          この日は既に写真が保存されています。撮影すると上書きされます。
        </p>
      )}

      <div>
        <label className="text-xs font-medium text-neutral-500" htmlFor="memo">
          メモ（任意）
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="睡眠時間、食事、使用した化粧品など"
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving || (!capturedForThisDate && !existingPhotoUrl && !memo)}
        className="w-full rounded-full bg-neutral-900 py-3 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
      >
        {saving ? "保存中…" : "この日付で保存する"}
      </button>

      {saved && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          保存しました。続けて
          <Link href="/record" className="mx-1 underline">
            記録画面
          </Link>
          で肌状態を5段階評価しましょう。
        </div>
      )}
    </div>
  );
}

function FaceGuide() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 200 260" className="h-[85%] opacity-70">
        <ellipse
          cx="100"
          cy="130"
          rx="70"
          ry="105"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        <line x1="100" y1="30" x2="100" y2="230" stroke="white" strokeWidth="1" strokeDasharray="2 6" />
        <line x1="35" y1="130" x2="165" y2="130" stroke="white" strokeWidth="1" strokeDasharray="2 6" />
      </svg>
      <span className="absolute bottom-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
        顔の輪郭を枠に合わせてください
      </span>
    </div>
  );
}
