import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iftype.github.io/uiux-trend-atlas/"),
  title: "UI/UX Trend Atlas — 2026 Frontend × WebView",
  description: "12개 UI/UX 트렌드, 2026 WebView 출시 기준, 프론트엔드 스킬 맵과 복사 가능한 오픈소스 샘플을 제공하는 모바일 우선 리서치 레포.",
  openGraph: {
    title: "UI/UX Trend Atlas",
    description: "UI/UX 흐름, 2026 WebView 기준, 프론트엔드 스킬 맵과 실행 가능한 샘플을 연결한 오픈 리서치.",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "og-sample-lab.png", width: 1536, height: 1024, alt: "UI/UX Trend Atlas — Sample Lab, Open Source, WebView 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Trend Atlas",
    description: "UI/UX·WebView 체크리스트, 오픈소스 분석과 복사 가능한 샘플을 제공하는 한국어 오픈 리서치.",
    images: ["og-sample-lab.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
