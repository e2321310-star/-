import Anthropic from "@anthropic-ai/sdk";

// このAPIキーはVercelの環境変数（ANTHROPIC_API_KEY）に設定する。クライアントには一切渡さない。
const client = new Anthropic();

const MODEL = "claude-opus-5-5";
const MAX_HISTORY = 20; // 直近のやり取りのみ送る（コスト・レイテンシ対策）
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `あなたはスキンケア記録アプリのアシスタント「スキンケアパートナー」です。

【役割】
・ユーザーのスキンケア記録をもとに、日々のケアや生活習慣について前向きで具体的なアドバイスを行う
・スキンケアの一般的な知識（洗顔、保湿、紫外線対策など）をわかりやすく説明する

【話し方】
・丁寧で親しみやすい口調
・専門用語には簡単な説明を添える
・回答は300字程度を目安に、要点を先に伝える

【必ず守るルール】
・肌の症状について診断をしない（「〇〇という病気です」などと断定しない）
・特定の化粧品や施術について「治る」「必ず効く」など効果を断定しない
・赤み、かゆみ、痛み、急な悪化などの相談があった場合は、皮膚科などの医療機関の受診をおすすめする
・医療行為（施術・薬の使用）についての具体的な判断は医師に委ねるよう伝える
・ユーザーの容姿を否定するような表現は使わない
・わからないことは推測で答えず、「確かな情報をお伝えできません」と正直に伝える`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValidHistory(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_MESSAGE_LENGTH
    )
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { messages, context } = (body ?? {}) as { messages?: unknown; context?: unknown };
  if (!isValidHistory(messages)) {
    return new Response("Invalid messages", { status: 400 });
  }
  const recent = messages.slice(-MAX_HISTORY);

  const system =
    typeof context === "string" && context.trim()
      ? `${SYSTEM_PROMPT}\n\n【ユーザーの最近のスキンケア記録（参考情報。聞かれない限り毎回繰り返す必要はない）】\n${context.slice(0, 1000)}`
      : SYSTEM_PROMPT;

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          output_config: { effort: "low" },
          system,
          messages: recent,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
        });
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nすみません、この内容にはお答えできませんでした。医療に関わる内容は医師にご相談ください。"
            )
          );
        }
      } catch (err) {
        console.error("chat API error", err);
        controller.enqueue(
          encoder.encode("\n\n[エラーが発生しました。しばらくしてからもう一度お試しください。]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
