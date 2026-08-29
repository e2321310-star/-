"use client";

import type { PhotoAnalysis } from "@/lib/photoAnalysis";

export default function PhotoAnalysisPanel({
  photoUrl,
  analysis,
}: {
  photoUrl: string;
  analysis: PhotoAnalysis;
}) {
  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt="解析対象の写真" className="h-full w-full object-cover" />
        {analysis.regions.map((r) => (
          <div
            key={r.key}
            className="absolute rounded-md border-2 border-dashed border-white/80"
            style={{
              left: `${r.rect.x * 100}%`,
              top: `${r.rect.y * 100}%`,
              width: `${r.rect.w * 100}%`,
              height: `${r.rect.h * 100}%`,
            }}
          >
            <span className="absolute -top-4 left-0 whitespace-nowrap rounded bg-black/60 px-1 text-[9px] text-white">
              {r.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        {analysis.notes.length > 0 ? (
          analysis.notes.map((note, i) => (
            <p
              key={i}
              className="rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600 dark:bg-white/5 dark:text-neutral-300"
            >
              💡 {note}
            </p>
          ))
        ) : (
          <p className="text-xs text-neutral-400">
            写真から特に強い特徴は検出されませんでした。セルフチェックの内容をもとに判断しています。
          </p>
        )}
      </div>
      <p className="mt-2 text-[11px] text-neutral-400">
        額・頬・鼻・あごの明るさや赤み・光沢を簡易的に比較した目安です。照明や角度によって結果が変わることがあります。
      </p>
    </div>
  );
}
