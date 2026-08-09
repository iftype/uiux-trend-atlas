import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "12 UI/UX 트렌드 — UI/UX Trend Atlas",
  description: "2026년 프론트엔드가 알아야 할 12개 UI/UX 흐름을 한 주제씩 탐색합니다.",
};

export default function TrendsPage() {
  return <TrendAtlas view="trends" />;
}
