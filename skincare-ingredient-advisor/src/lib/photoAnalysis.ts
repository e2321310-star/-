import type { ConcernKey } from "./types";

export interface RegionRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RegionMetric {
  key: string;
  label: string;
  rect: RegionRect;
  brightness: number; // 0-255
  redness: number; // R - (G+B)/2, おおよそ -50〜+50
  shineRatio: number; // 明るい(反射)ピクセルの割合 0-1
  textureVariance: number; // 明るさの標準偏差（キメ・凹凸の目安）
}

export interface PhotoAnalysis {
  regions: RegionMetric[];
  concernSignals: Partial<Record<ConcernKey, number>>;
  notes: string[];
}

// 顔ガイド枠（診断画面のFaceGuideと同じ楕円）を基準にした、写真内の相対位置(0〜1)
export const ANALYSIS_REGIONS: { key: string; label: string; rect: RegionRect }[] = [
  { key: "forehead", label: "額", rect: { x: 0.3, y: 0.14, w: 0.4, h: 0.14 } },
  { key: "cheekL", label: "左頬", rect: { x: 0.16, y: 0.42, w: 0.22, h: 0.2 } },
  { key: "cheekR", label: "右頬", rect: { x: 0.62, y: 0.42, w: 0.22, h: 0.2 } },
  { key: "nose", label: "鼻・Tゾーン", rect: { x: 0.42, y: 0.32, w: 0.16, h: 0.28 } },
  { key: "chin", label: "あご", rect: { x: 0.36, y: 0.74, w: 0.28, h: 0.14 } },
];

// 「顔全体の平均」に対して各部位がどれだけ差があるかで判定する（肌の色味や明るさの個人差に影響されにくくするため）
const TEXTURE_DELTA = 5; // 鼻・あご・頬のキメの粗さが平均よりどれだけ高いか
const SHINE_DELTA = 0.05; // Tゾーンの光沢(テカリ)が頬よりどれだけ多いか
const REDNESS_DELTA = 4; // 頬の赤みが顔全体平均よりどれだけ高いか
const BRIGHTNESS_SPREAD_THRESHOLD = 9; // 部位間の明るさのばらつき（色ムラの目安）

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function stddev(nums: number[]): number {
  if (nums.length === 0) return 0;
  const avg = average(nums);
  return Math.sqrt(average(nums.map((n) => (n - avg) ** 2)));
}

function sampleRegion(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  pw: number,
  ph: number
): Omit<RegionMetric, "key" | "label" | "rect"> {
  const w = Math.max(1, Math.min(pw, ctx.canvas.width - px));
  const h = Math.max(1, Math.min(ph, ctx.canvas.height - py));
  if (w <= 0 || h <= 0 || px < 0 || py < 0) {
    return { brightness: 0, redness: 0, shineRatio: 0, textureVariance: 0 };
  }
  const { data } = ctx.getImageData(px, py, w, h);
  const step = 2; // 間引いてサンプリングし処理を軽くする
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  const luminances: number[] = [];
  let brightCount = 0;
  let n = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      sumR += r;
      sumG += g;
      sumB += b;
      luminances.push(l);
      if (l > 205) brightCount++;
      n++;
    }
  }
  if (n === 0) return { brightness: 0, redness: 0, shineRatio: 0, textureVariance: 0 };
  const avgR = sumR / n;
  const avgG = sumG / n;
  const avgB = sumB / n;
  return {
    brightness: average(luminances),
    redness: avgR - (avgG + avgB) / 2,
    shineRatio: brightCount / n,
    textureVariance: stddev(luminances),
  };
}

function analyzeCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): PhotoAnalysis {
  const regions: RegionMetric[] = ANALYSIS_REGIONS.map((r) => {
    const metrics = sampleRegion(
      ctx,
      Math.round(r.rect.x * width),
      Math.round(r.rect.y * height),
      Math.round(r.rect.w * width),
      Math.round(r.rect.h * height)
    );
    return { key: r.key, label: r.label, rect: r.rect, ...metrics };
  });

  const byKey = (key: string) => regions.find((r) => r.key === key);
  const cheeks = [byKey("cheekL"), byKey("cheekR")].filter((r): r is RegionMetric => !!r);
  const tZone = [byKey("forehead"), byKey("nose")].filter((r): r is RegionMetric => !!r);
  const textureRegions = [byKey("nose"), byKey("chin"), byKey("cheekL"), byKey("cheekR")].filter(
    (r): r is RegionMetric => !!r
  );

  const overallRedness = average(regions.map((r) => r.redness));
  const overallTexture = average(regions.map((r) => r.textureVariance));
  const brightnessSpread = stddev(regions.map((r) => r.brightness));

  const concernSignals: Partial<Record<ConcernKey, number>> = {};
  const notes: string[] = [];

  if (average(textureRegions.map((r) => r.textureVariance)) - overallTexture > TEXTURE_DELTA) {
    concernSignals.pores = (concernSignals.pores ?? 0) + 1;
    notes.push("鼻・あご・頬のキメの粗さ（明暗差）が顔全体の平均より大きく、毛穴・凹凸が目立ちやすい可能性があります。");
  }
  if (average(tZone.map((r) => r.shineRatio)) - average(cheeks.map((r) => r.shineRatio)) > SHINE_DELTA) {
    concernSignals.oiliness = (concernSignals.oiliness ?? 0) + 1;
    notes.push("額・鼻のTゾーンが頬より光沢（テカリ）が強く出ています。");
  }
  if (average(cheeks.map((r) => r.redness)) - overallRedness > REDNESS_DELTA) {
    concernSignals.soothing = (concernSignals.soothing ?? 0) + 1;
    notes.push("頬の赤みが顔全体の平均より強く出ています。");
  }
  if (brightnessSpread > BRIGHTNESS_SPREAD_THRESHOLD) {
    concernSignals.brightening = (concernSignals.brightening ?? 0) + 1;
    notes.push("部位ごとの明るさにばらつきがあり、色ムラが目立ちやすい可能性があります。");
  }

  return { regions, concernSignals, notes };
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export async function analyzePhotoBlob(blob: Blob): Promise<PhotoAnalysis> {
  const img = await loadImage(blob);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { regions: [], concernSignals: {}, notes: [] };
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return analyzeCanvas(ctx, canvas.width, canvas.height);
}
