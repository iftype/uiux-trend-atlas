import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "글로벌 UI/UX 기술 아티클 — UI/UX Trend Atlas",
  description: "해외 제품·디자인·프론트엔드 팀의 공식 피드를 페이지별로 탐색합니다.",
};

export default function GlobalPage() {
  return <TrendAtlas view="global" />;
}
