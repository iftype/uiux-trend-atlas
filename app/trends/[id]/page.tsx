import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { trends } from "../../data";
import { TrendAtlas } from "../../trend-atlas";

export const dynamicParams = false;

export function generateStaticParams() {
  return trends.map((trend) => ({ id: trend.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const trend = trends.find((item) => item.id === id);
  return trend ? { title: `${trend.title} — UI/UX Trend Atlas`, description: trend.summary } : {};
}

export default async function TrendPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!trends.some((trend) => trend.id === id)) notFound();
  return <TrendAtlas view="trend" trendId={id} />;
}
