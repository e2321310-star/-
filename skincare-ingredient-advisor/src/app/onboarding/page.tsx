"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveProfile } from "@/lib/db";
import {
  AGE_BAND_LABELS,
  AGE_BAND_ORDER,
  BUDGET_LABELS,
  BUDGET_ORDER,
  EXPERIENCE_LABELS,
  EXPERIENCE_ORDER,
  GENDER_LABELS,
  GENDER_ORDER,
  INTEREST_SCOPE_LABELS,
  INTEREST_SCOPE_ORDER,
  ONBOARDING_CONCERN_LABELS,
  ONBOARDING_CONCERN_ORDER,
  type AgeBand,
  type Budget,
  type Gender,
  type InterestScope,
  type OnboardingConcern,
  type SkincareExperience,
} from "@/lib/types";
import { Icon, type IconName } from "@/components/icons";

const TOTAL_STEPS = 6;

const CONCERN_ICON: Record<OnboardingConcern, IconName> = {
  acne: "dot",
  pores: "grid",
  dryness: "droplet",
  dullness: "cloud",
  spots: "dot",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [ageBand, setAgeBand] = useState<AgeBand | undefined>(undefined);
  const [concerns, setConcerns] = useState<OnboardingConcern[]>([]);
  const [experience, setExperience] = useState<SkincareExperience | undefined>(undefined);
  const [interestScope, setInterestScope] = useState<InterestScope | undefined>(undefined);
  const [budget, setBudget] = useState<Budget | undefined>(undefined);

  useEffect(() => {
    getProfile().then((p) => {
      setGender(p.gender);
      setAgeBand(p.ageBand);
      setConcerns(p.onboardingConcerns ?? []);
      setExperience(p.skincareExperience);
      setInterestScope(p.interestScope);
      setBudget(p.budget);
      setLoaded(true);
    });
  }, []);

  function toggleConcern(c: OnboardingConcern) {
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function finish(finalBudget: Budget) {
    const existing = await getProfile();
    await saveProfile({
      ...existing,
      id: "default",
      gender,
      ageBand,
      onboardingConcerns: concerns,
      skincareExperience: experience,
      interestScope,
      budget: finalBudget,
      onboardingCompleted: true,
    });
    router.replace("/");
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  if (!loaded) {
    return <p className="pt-10 text-center text-sm text-[var(--foreground-muted)]">読み込み中…</p>;
  }

  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-6 pt-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ backgroundColor: i <= step ? "var(--accent)" : "var(--card-border)" }}
            />
          ))}
        </div>
        <p className="text-xs font-semibold text-[var(--foreground-muted)]">
          {step + 1} / {TOTAL_STEPS}
        </p>
      </header>

      <div className="flex-1">
        {step === 0 && (
          <Question title="性別を教えてください">
            <OptionGrid cols={1}>
              {GENDER_ORDER.map((g) => (
                <OptionButton
                  key={g}
                  selected={gender === g}
                  onClick={() => {
                    setGender(g);
                    next();
                  }}
                >
                  {GENDER_LABELS[g]}
                </OptionButton>
              ))}
            </OptionGrid>
          </Question>
        )}

        {step === 1 && (
          <Question title="年代を教えてください">
            <OptionGrid cols={1}>
              {AGE_BAND_ORDER.map((a) => (
                <OptionButton
                  key={a}
                  selected={ageBand === a}
                  onClick={() => {
                    setAgeBand(a);
                    next();
                  }}
                >
                  {AGE_BAND_LABELS[a]}
                </OptionButton>
              ))}
            </OptionGrid>
          </Question>
        )}

        {step === 2 && (
          <Question title="気になる肌の悩みは？" subtitle="あてはまるものをすべて選んでください（複数選択可）">
            <OptionGrid cols={2}>
              {ONBOARDING_CONCERN_ORDER.map((c) => (
                <OptionButton key={c} selected={concerns.includes(c)} onClick={() => toggleConcern(c)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name={CONCERN_ICON[c]} className="h-4 w-4" />
                    {ONBOARDING_CONCERN_LABELS[c]}
                  </span>
                </OptionButton>
              ))}
            </OptionGrid>
            <button
              onClick={next}
              disabled={concerns.length === 0}
              className="mt-5 w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--accent-contrast)] disabled:opacity-40"
            >
              次へ
            </button>
          </Question>
        )}

        {step === 3 && (
          <Question title="スキンケアの経験は？">
            <OptionGrid cols={1}>
              {EXPERIENCE_ORDER.map((e) => (
                <OptionButton
                  key={e}
                  selected={experience === e}
                  onClick={() => {
                    setExperience(e);
                    next();
                  }}
                >
                  {EXPERIENCE_LABELS[e]}
                </OptionButton>
              ))}
            </OptionGrid>
          </Question>
        )}

        {step === 4 && (
          <Question title="興味のある範囲は？" subtitle="あとから設定画面でいつでも変更できます">
            <OptionGrid cols={1}>
              {INTEREST_SCOPE_ORDER.map((i) => (
                <OptionButton
                  key={i}
                  selected={interestScope === i}
                  onClick={() => {
                    setInterestScope(i);
                    next();
                  }}
                >
                  {INTEREST_SCOPE_LABELS[i]}
                </OptionButton>
              ))}
            </OptionGrid>
          </Question>
        )}

        {step === 5 && (
          <Question title="1ヶ月の予算感は？" subtitle="ホーム画面からいつでも切り替えられます">
            <OptionGrid cols={1}>
              {BUDGET_ORDER.map((b) => (
                <OptionButton
                  key={b}
                  selected={budget === b}
                  onClick={() => {
                    setBudget(b);
                    finish(b);
                  }}
                >
                  {BUDGET_LABELS[b]}
                </OptionButton>
              ))}
            </OptionGrid>
          </Question>
        )}
      </div>

      {step > 0 && (
        <button onClick={back} className="self-start text-xs font-semibold text-[var(--foreground-muted)]">
          ← 戻る
        </button>
      )}
    </div>
  );
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function OptionGrid({ cols, children }: { cols: 1 | 2; children: React.ReactNode }) {
  return <div className={`grid gap-2.5 ${cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>{children}</div>;
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-all active:scale-[0.98] ${
        selected
          ? "border-transparent bg-[var(--accent)] text-[var(--accent-contrast)]"
          : "border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}
