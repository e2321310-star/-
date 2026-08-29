import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Mochiy_Pop_One } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mochiyPopOne = Mochiy_Pop_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "成分アドバイザー",
  description: "写真と気温・肌質から不足成分とブランド商品を提案する自分専用アプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ec4899",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${mochiyPopOne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
