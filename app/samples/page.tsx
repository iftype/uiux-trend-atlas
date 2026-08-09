import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "UI/UX 실행 샘플과 스킬 맵 — UI/UX Trend Atlas",
  description: "상태, 접근성, WebView 폴백이 포함된 실행 샘플과 프론트엔드 스킬 맵입니다.",
};

export default function SamplesPage() {
  return <TrendAtlas view="samples" />;
}
