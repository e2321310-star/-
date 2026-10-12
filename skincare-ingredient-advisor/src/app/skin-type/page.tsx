"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveProfile } from "@/lib/db";
import {
  FULL_SKIN_TYPE_DESCRIPTIONS,
  FULL_SKIN_TYPE_TIPS,
  SENSITIVE_TIP,
  SKIN_QUIZ_QUESTIONS,
  diagnoseSkinType,
  type SkinQuizResult,
} from "@/lib/skinTypeQuiz";
import { FULL_SKIN_TYPE_LABELS, type SkinType } from "@/lib/types";

const TOTAL = SKIN_QUIZ_QUESTIONS.length;

// 新しい肌タイプ診断の結果を、診断/おすすめロジックが参照する既存の肌質(SkinType)にも反映する。
// 敏感肌の傾向がある場合は、既存ロジック側の「敏感肌」重み付けを使うため sensitive を優先する。
function toLegacySkinType(result: SkinQuizResult): SkinType {
  if (result.sensitive) return "sensitive";
  return result.skinType;
}

export default function SkinTypeQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SkinQuizResult | null>(null);
  const [saving, setSaving] = useState(false);

  async function choose(optionIndex: number) {
    const nextAnswers = [...answers.slice(0, step), optionIndex];
    setAnswers(nextAnswers);

    if (step + 1 < TOTAL) {
      setStep(step + 1);
      return;
    }

    const diagnosis = diagnoseSkinType(nextAnswers);
    setResult(diagnosis);
  }

  function back() {
    if (result) {
      // 結果画面から戻る場合は最後の質問に戻る
      setResult(null);
      setStep(TOTAL - 1);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  function retake() {
    setAnswers([]);
    setStep(0);
    setResult(null);
  }

  async function startRecording() {
    if (!result) return;
    setSaving(true);
    const existing = await getProfile();
    await saveProfile({
      ...existing,
      id: "default",
      skinType: toLegacySkinType(result),
      skinTypeDiagnosis: { ...result, diagnosedAt: new Date().toISOString() },
    });
    router.push("/");
  }

  if (result) {
    const label = `${FULL_SKIN_TYPE_LABELS[result.skinType]}${result.sensitive ? "（敏感肌の傾向あり）" : ""}`;
    const tips = FULL_SKIN_TYPE_TIPS[result.skinType];

    return (
      <div className="flex flex-col gap-5 pt-4">
        <header className="text-center">
          <p className="text-xs font-semibold text-neutral-400">診断結果</p>
          <h1 className="mt-1.5 text-2xl font-bold">{label}</h1>
        </header>

        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {FULL_SKIN_TYPE_DESCRIPTIONS[result.skinType]}
          </p>
          {result.sensitive && (
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{SENSITIVE_TIP}</p>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold">💡 今日からできるケアのポイント</h2>
          <ul className="mt-2.5 flex flex-col gap-2">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <span className="shrink-0">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-2">
          <button
            onClick={startRecording}
            disabled={saving}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-900/20 disabled:opacity-60"
          >
            この肌タイプで記録を始める
          </button>
          <button
            onClick={retake}
            className="w-full rounded-full border border-neutral-300 py-2.5 text-sm font-medium dark:border-neutral-700"
          >
            もう一度診断する
          </button>
        </div>

        <p className="pt-1 text-center text-[11px] leading-relaxed text-neutral-400">
          この診断は目安です。肌トラブルが続く場合は皮膚科などの専門医にご相談ください。
        </p>
      </div>
    );
  }

  const question = SKIN_QUIZ_QUESTIONS[step];

  return (
    <div className="flex flex-col gap-6 pt-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          {SKIN_QUIZ_QUESTIONS.map((q, i) => (
            <span
              key={q.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500" : "bg-neutral-200 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="text-xs font-semibold text-neutral-400">
          {step + 1} / {TOTAL}
        </p>
      </header>

      <div className="flex-1">
        <h1 className="text-xl font-bold leading-snug">{question.text}</h1>
        <div className="mt-5 grid grid-cols-1 gap-2.5">
          {question.options.map((opt, i) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => choose(i)}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3.5 text-left text-sm font-semibold text-neutral-600 shadow-sm transition-all active:scale-[0.98] dark:text-neutral-300"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button onClick={back} className="self-start text-xs font-semibold text-neutral-400">
          ← 戻る
        </button>
      )}
    </div>
  );
}
