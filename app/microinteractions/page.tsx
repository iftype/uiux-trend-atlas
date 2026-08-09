import type { Metadata } from "next";
import { TrendAtlas } from "../trend-atlas";

export const metadata: Metadata = {
  title: "마이크로인터랙션 사례와 샘플 — UI/UX Trend Atlas",
  description: "국내 기업 사례, 오픈소스 저장소와 직접 작동하는 마이크로인터랙션 샘플을 모았습니다.",
};

export default function MicrointeractionsPage() {
  return <TrendAtlas view="micro" />;
}
