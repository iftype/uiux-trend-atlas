import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "UI/UX 오픈소스 스택 — UI/UX Trend Atlas",
  description: "UI 모션, 접근성, WebView와 품질 도구를 용도·주의점·라이선스 기준으로 비교합니다.",
};

export default function OpenSourcePage() {
  return <TrendAtlas view="opensource" />;
}
