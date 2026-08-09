import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "공식 UI/UX 기술 채널 — UI/UX Trend Atlas",
  description: "실리콘밸리와 글로벌 제품 팀의 공식 디자인·엔지니어링 채널 디렉터리입니다.",
};

export default function SourcesPage() {
  return <TrendAtlas view="sources" />;
}
