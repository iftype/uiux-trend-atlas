import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "2026 Frontend × WebView 가이드 — UI/UX Trend Atlas",
  description: "브라우저와 앱 컨테이너를 함께 다루는 2026 프론트엔드 출시 기준과 테스트 매트릭스입니다.",
};

export default function FieldGuidePage() {
  return <TrendAtlas view="guide" />;
}
