import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const catalogPath = resolve(root, "data/foreign-tech-blogs.json");
const publicPath = resolve(root, "public/data/foreign-updates.json");
const appPath = resolve(root, "app/generated/foreign-updates.json");
const markdownPath = resolve(root, "research/13-foreign-tech-blogs/LATEST.md");

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const previous = await readJson(publicPath, { sources: [], articles: [] });
const previousBySource = new Map(previous.sources.map((source) => [source.id, source]));

const uxKeywords = [
  "accessib", "animation", "canvas", "client", "color", "component", "content design",
  "dark mode", "design", "experiment", "font", "frontend", "front-end", "gesture",
  "haptic", "homepage", "interaction", "interface", "mobile", "motion",
  "personalization", "prototype", "recommend", "research", "search", "spatial",
  "typography", "user experience", "user interface", "ux", "visual", "web performance",
  "3d", "ar", "vr", "xr",
];

const topicRules = {
  "realtime-content": ["real-time", "realtime", "live", "messaging", "collaboration", "stream"],
  "immersive-scrolling": ["scroll", "parallax", "narrative", "storytelling"],
  "bold-color": ["color", "brand", "visual identity", "illustration"],
  "3d-graphics-animation": ["3d", "animation", "render", "canvas", "webgl", "graphics"],
  "biometric-auth": ["passkey", "authentication", "biometric", "identity", "security"],
  "ar-vr": ["augmented reality", "virtual reality", "spatial", "ar", "vr", "xr"],
  "personalization": ["personalization", "recommend", "experiment", "ranking", "search"],
  "sustainable-design": ["performance", "sustainab", "inclusive", "accessib", "efficiency"],
  "dark-mode": ["dark mode", "theme", "color scheme"],
  "kinetic-typography": ["typography", "type", "font", "motion"],
  "gamification": ["game", "reward", "streak", "motivation"],
  "microinteractions": ["interaction", "motion", "feedback", "component", "toast", "gesture"],
};

const feedSources = catalog.filter((source) => source.feed);
const settled = await Promise.all(feedSources.map(updateSource));
const successful = settled.filter((source) => source.status === "ok").length;

if (successful === 0) {
  throw new Error("Every configured feed failed. Existing data was left untouched.");
}

const allArticles = settled
  .flatMap((source) => source.articles.map((article) => ({ ...article, sourceId: source.id, source: source.name, company: source.company })))
  .sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));
const uniqueArticles = dedupeByUrl(allArticles).slice(0, 80);

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  stats: {
    catalogSources: catalog.length,
    feedSources: feedSources.length,
    healthyFeeds: successful,
    articles: uniqueArticles.length,
  },
  sources: settled,
  articles: uniqueArticles,
};

await Promise.all([
  writeJson(publicPath, output),
  writeJson(appPath, output),
  writeText(markdownPath, renderMarkdown(output)),
]);

console.log(`Updated ${output.articles.length} articles from ${successful}/${feedSources.length} healthy feeds.`);

async function updateSource(source) {
  const prior = previousBySource.get(source.id);
  try {
    const response = await fetchWithTimeout(source.feed, 18_000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const feedItems = parseFeed(xml);
    if (feedItems.length === 0) throw new Error("No feed items parsed");
    const parsed = feedItems
      .filter((article) => source.feedMode === "all" || isUxRelevant(article))
      .map((article) => ({ ...article, topics: classify(article, source.topics) }))
      .filter((article) => article.url && article.title)
      .slice(0, 8);

    return {
      id: source.id,
      company: source.company,
      name: source.name,
      url: source.url,
      feed: source.feed,
      status: "ok",
      checkedAt: new Date().toISOString(),
      articles: parsed,
    };
  } catch (error) {
    return {
      id: source.id,
      company: source.company,
      name: source.name,
      url: source.url,
      feed: source.feed,
      status: "stale",
      checkedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      articles: prior?.articles ?? [],
    };
  }
}

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "uiux-trend-atlas/1.0 (+https://github.com/iftype/uiux-trend-atlas)" },
    });
  } finally {
    clearTimeout(timer);
  }
}

function parseFeed(xml) {
  const blocks = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((match) => match[0]);
  return blocks.map((block) => {
    const title = cleanText(matchTag(block, "title"));
    const description = cleanText(matchTag(block, "description") || matchTag(block, "summary") || matchTag(block, "content:encoded"));
    const linkTag = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
    const linkText = cleanText(matchTag(block, "link"));
    const url = normalizeUrl(linkTag || linkText || matchTag(block, "guid"));
    const publishedAt = normalizeDate(
      cleanText(matchTag(block, "pubDate") || matchTag(block, "published") || matchTag(block, "updated") || matchTag(block, "dc:date")),
    );
    return { title, url, publishedAt, summary: truncate(description, 220) };
  });
}

function matchTag(block, tag) {
  return block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "";
}

function cleanText(value) {
  return decodeEntities(value)
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", "#39": "'" };
  return value
    .replace(/&([a-z]+|#\d+);/gi, (_, key) => {
      if (key.startsWith("#")) return String.fromCodePoint(Number(key.slice(1)));
      return entities[key.toLowerCase()] ?? `&${key};`;
    });
}

function normalizeUrl(value) {
  const decoded = decodeEntities(value).trim();
  if (!decoded.startsWith("http")) return "";
  try {
    const url = new URL(decoded);
    ["source", "utm_campaign", "utm_medium", "utm_source"].forEach((key) => url.searchParams.delete(key));
    return url.toString();
  } catch {
    return decoded;
  }
}

function normalizeDate(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

function isUxRelevant(article) {
  const title = article.title.toLowerCase();
  const strictSummary = article.summary.toLowerCase();
  const titleMatch = uxKeywords.some((keyword) => wordMatch(title, keyword));
  const summaryPhrases = [
    "accessibility", "design system", "interaction design", "user experience",
    "user interface", "content design", "frontend", "front-end", "web performance",
    "mobile app", "client-side", "client experience",
  ];
  return titleMatch || summaryPhrases.some((phrase) => strictSummary.includes(phrase));
}

function classify(article, fallback = []) {
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  const matches = Object.entries(topicRules)
    .filter(([, keywords]) => keywords.some((keyword) => wordMatch(haystack, keyword)))
    .map(([topic]) => topic);
  return matches.length > 0 ? [...new Set(matches)].slice(0, 4) : fallback.slice(0, 2);
}

function wordMatch(haystack, keyword) {
  if (keyword.includes(" ")) return haystack.includes(keyword);
  if (keyword.length <= 2) return new RegExp(`(^|[^a-z0-9])${keyword}([^a-z0-9]|$)`, "i").test(haystack);
  return new RegExp(`(^|[^a-z0-9])${keyword}`, "i").test(haystack);
}

function truncate(value, length) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trim()}…`;
}

function dedupeByUrl(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function renderMarkdown(data) {
  const lines = [
    "# Latest Foreign UI/UX Articles",
    "",
    `자동 갱신: **${data.generatedAt.slice(0, 10)}** · 정상 피드 **${data.stats.healthyFeeds}/${data.stats.feedSources}** · 수집 글 **${data.articles.length}개**`,
    "",
    "> 이 문서는 GitHub Actions가 공식 RSS/Atom 피드의 제목·링크·발행일만 수집해 생성합니다. 본문은 복제하지 않습니다.",
    "",
    "| 발행일 | 출처 | 글 | 연결 주제 |",
    "|---|---|---|---|",
  ];
  for (const article of data.articles.slice(0, 60)) {
    const date = article.publishedAt?.slice(0, 10) ?? "날짜 없음";
    const topics = article.topics.map((topic) => `\`${topic}\``).join(" ");
    lines.push(`| ${date} | ${escapeMd(article.source)} | [${escapeMd(article.title)}](${article.url}) | ${topics} |`);
  }
  lines.push("", "## Feed health", "", "| 출처 | 상태 | 확인 시각 |", "|---|---|---|");
  for (const source of data.sources) {
    lines.push(`| [${escapeMd(source.name)}](${source.url}) | ${source.status} | ${source.checkedAt.slice(0, 16).replace("T", " ")} UTC |`);
  }
  return `${lines.join("\n")}\n`;
}

function escapeMd(value) {
  return value.replaceAll("|", "\\|").replaceAll("[", "\\[").replaceAll("]", "\\]");
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(path, data) {
  await writeText(path, `${JSON.stringify(data, null, 2)}\n`);
}

async function writeText(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}
