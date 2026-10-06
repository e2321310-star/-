// 肌ナビ オリジナルの画面背景コンポーネント。
// 白〜ごく薄いニュートラルカラーへの淡いグラデーションと、画面端のぼかした光(円形グロー)
// 2つだけで構成。柄・写真・イラストは使わない。既存コスメブランド・他社アプリの
// デザインは参照・模倣していない。
//
// 色は globals.css の [data-accent="..."] トークンにまとめてあるため、
// accent を切り替えるだけで配色一式が入れ替わる(ライト/ダークモード両対応)。
export type AccentTheme = "mint" | "blue" | "beige";

export default function AppBackground({ accent = "mint" }: { accent?: AccentTheme }) {
  return <div data-accent={accent} className="navi-bg pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}
