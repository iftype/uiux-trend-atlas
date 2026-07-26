import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iftype.github.io/uiux-trend-atlas/"),
  title: "UI/UX Trend Atlas — 12개의 인터페이스 흐름",
  description: "실시간 콘텐츠부터 마이크로인터랙션까지, 모바일 우선 UI/UX 트렌드 리서치 레포.",
  openGraph: {
    title: "UI/UX Trend Atlas",
    description: "실시간 콘텐츠부터 마이크로인터랙션까지, 12개의 인터페이스 흐름.",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "og.png", width: 1731, height: 909, alt: "UI/UX Trend Atlas 2026 Edition" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Trend Atlas",
    description: "12개의 인터페이스 흐름을 연결한 한국어 오픈 리서치 레포.",
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
