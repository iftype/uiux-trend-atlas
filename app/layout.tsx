import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iftype.github.io/uiux-trend-atlas/"),
  title: "UI/UX Trend Atlas — 2026 Frontend × WebView",
  description: "12개 UI/UX 트렌드와 2026 프론트엔드·WebView 출시 기준, 국내외 공식 기술 자료를 자동 갱신하는 모바일 우선 리서치 레포.",
  openGraph: {
    title: "UI/UX Trend Atlas",
    description: "12개의 인터페이스 흐름과 2026 프론트엔드·WebView 출시 기준을 연결한 오픈 리서치.",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "og.png", width: 1731, height: 909, alt: "UI/UX Trend Atlas 2026 Edition" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Trend Atlas",
    description: "UI/UX 흐름, WebView 출시 체크리스트와 해외 공식 기술 자료를 자동 갱신하는 한국어 오픈 리서치.",
    images: ["og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
