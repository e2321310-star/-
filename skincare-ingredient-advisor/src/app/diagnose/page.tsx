"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDiagnose, getProfile, saveDiagnose, saveProfile } from "@/lib/db";
import {
  CONCERN_LABELS,
  CONCERN_ORDER,
  SKIN_TYPE_LABELS,
  SKIN_TYPE_ORDER,
  type ConcernKey,
  type SkinType,
} from "@/lib/types";
import { CONCERN_BADGE_CLASS } from "@/lib/theme";
import { todayStr } from "@/lib/date";
import { analyzePhotoBlob, type PhotoAnalysis } from "@/lib/photoAnalysis";
import PhotoAnalysisPanel from "@/components/PhotoAnalysisPanel";

export default function DiagnosePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const date = todayStr();

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capture, setCapture] = useState<{ blob: Blob; url: string } | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [analyzedBlob, setAnalyzedBlob] = useState<Blob | null>(null);

  const [concerns, setConcerns] = useState<ConcernKey[]>([]);
  const [temperature, setTemperature] = useState("");
  const [skinType, setSkinType] = useState<SkinType | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (!cancelled) {
          setCameraError("カメラを起動できませんでした。ブラウザのカメラ権限を許可してください。");
        }
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getDiagnose(date), getProfile()]).then(([rec, profile]) => {
      if (cancelled) return;
      setExistingPhoto(rec?.photo ? { blob: rec.photo, url: URL.createObjectURL(rec.photo) } : null);
      setConcerns(rec?.concerns ?? []);
      setTemperature(rec?.temperatureC != null ? String(rec.temperatureC) : "");
      setSkinType(rec?.skinType ?? profile.skinType);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePhoto = capture ?? existingPhoto;

  useEffect(() => {
    if (!activePhoto) return;
    let cancelled = false;
    const blob = activePhoto.blob;
    analyzePhotoBlob(blob).then((result) => {
      if (!cancelled) {
        setPhotoAnalysis(result);
        setAnalyzedBlob(blob);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhoto?.blob]);

  const analyzing = !!activePhoto && analyzedBlob !== activePhoto.blob;

  function toggleConcern(key: ConcernKey) {
    setConcerns((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }

  function handleCapture() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapture({ blob, url: URL.createObjectURL(blob) });
      },
      "image/jpeg",
      0.92
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const existing = await getDiagnose(date);
      const temperatureC = temperature.trim() === "" ? undefined : Number(temperature);
      await saveDiagnose({
        date,
        photo: capture?.blob ?? existing?.photo,
        concerns,
        temperatureC,
        skinType,
        updatedAt: new Date().toISOString(),
      });
      if (skinType) {
        const profile = await getProfile();
        await saveProfile({ ...profile, id: "default", skinType });
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  const photoUrl = activePhoto?.url ?? null;

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-bold">診断</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          写真を撮る + 今日の気温・気になる部位・肌質を入力して診断します。
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold">写真</h2>
        <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-black">
          {!photoUrl && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full scale-x-[-1] object-cover"
            />
          )}
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="撮影プレビュー" className="h-full w-full object-cover" />
          )}
          {!photoUrl && !cameraError && <FaceGuide />}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white">
              {cameraError}
            </div>
          )}
        </div>
        {!capture && !cameraError && (
          <button
            onClick={handleCapture}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-2.5 text-sm font-semibold text-white active:opacity-90"
          >
            {existingPhoto ? "撮り直す" : "撮影する"}
          </button>
        )}
        {capture && (
          <button
            onClick={() => setCapture(null)}
            className="mt-2 w-full rounded-full border border-neutral-300 py-2.5 text-sm font-semibold dark:border-neutral-700"
          >
            撮り直す
          </button>
        )}
      </section>

      {photoUrl && (
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold">📷 写真のどこを見て判断しているか</h2>
          {analyzing && <p className="mt-2 text-xs text-neutral-400">写真を解析中…</p>}
          {!analyzing && photoAnalysis && (
            <div className="mt-2">
              <PhotoAnalysisPanel photoUrl={photoUrl} analysis={photoAnalysis} />
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold">気になる部位（セルフチェック）</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONCERN_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleConcern(key)}
              aria-pressed={concerns.includes(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                concerns.includes(key)
                  ? CONCERN_BADGE_CLASS[key]
                  : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
              }`}
            >
              {CONCERN_LABELS[key]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-neutral-400">気になるものをタップして選択してください（複数選択可）</p>
      </section>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold">今日の気温</h2>
        <input
          type="number"
          inputMode="numeric"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          placeholder="例：28（℃）"
          className="mt-2 w-full rounded-lg border border-[var(--card-border)] bg-neutral-50 px-3 py-2 text-sm dark:bg-white/5"
        />
      </section>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold">肌質</h2>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {SKIN_TYPE_ORDER.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSkinType(type)}
              aria-pressed={skinType === type}
              className={`rounded-lg py-2 text-center text-xs font-semibold transition-colors ${
                skinType === type
                  ? "bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-sm shadow-pink-900/20"
                  : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
              }`}
            >
              {SKIN_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-900/20 transition-opacity disabled:opacity-40"
      >
        {saving ? "保存中…" : "診断する"}
      </button>

      {saved && (
        <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
          保存しました。続けて
          <Link href="/result" className="mx-1 font-semibold underline">
            診断結果
          </Link>
          を確認しましょう。
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
