"use client";

import { useEffect, useRef, useState } from "react";
import { getAllDiagnoses, getProfile } from "@/lib/db";
import { CONCERN_LABELS, SKIN_TYPE_LABELS } from "@/lib/types";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "こんにちは、スキンケアパートナーです🌿 スキンケアのお悩みや、日々のケアについて何でも聞いてくださいね。",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contextRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([getProfile(), getAllDiagnoses()]).then(([profile, diagnoses]) => {
      const parts: string[] = [];
      if (profile.skinType) parts.push(`肌質: ${SKIN_TYPE_LABELS[profile.skinType]}`);
      if (profile.age != null) parts.push(`年齢: ${profile.age}歳`);
      const latest = diagnoses[0];
      if (latest) {
        if (latest.concerns.length > 0) {
          parts.push(`直近の気になる部位: ${latest.concerns.map((c) => CONCERN_LABELS[c]).join("・")}`);
        }
        if (latest.temperatureC != null) parts.push(`直近の気温: ${latest.temperatureC}℃`);
      }
      contextRef.current = parts.join(" / ");
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.content.trim()),
          context: contextRef.current,
        }),
      });
      if (!res.ok || !res.body) {
        throw new Error("リクエストに失敗しました");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setError("メッセージの送信に失敗しました。通信環境を確認してもう一度お試しください。");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col gap-3">
      <header>
        <h1 className="text-lg font-bold">スキンケアパートナー</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          スキンケアの悩みや日々のケアについて、チャットで相談できます。
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        一般的な知識に基づくアドバイスで、診断や治療の代わりにはなりません。赤み・かゆみ・痛みなどがある場合や症状が長引く場合は、皮膚科を受診してください。
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl p-3">
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 text-white"
                    : "bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
                }`}
              >
                {m.content || (sending && i === messages.length - 1 ? "…" : "")}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="スキンケアについて聞いてみる…"
          rows={1}
          className="min-h-[44px] flex-1 resize-none rounded-2xl border border-[var(--card-border)] bg-neutral-50 px-3.5 py-2.5 text-sm dark:bg-white/5"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="shrink-0 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-900/20 transition-opacity disabled:opacity-40"
        >
          {sending ? "…" : "送信"}
        </button>
      </form>
    </div>
  );
}
