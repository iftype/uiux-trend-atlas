import type { MetadataRoute } from "next";
import { trends } from "./data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://iftype.github.io/uiux-trend-atlas";
  const routes = ["", "/trends", "/microinteractions", "/global", "/sources", "/field-guide", "/samples", "/open-source"];
  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}/`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...trends.map((trend) => ({ url: `${baseUrl}/trends/${trend.id}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
