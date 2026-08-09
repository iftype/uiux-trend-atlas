import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { evaluateRobots } from "./lib/robots.mjs";

const root = resolve(import.meta.dirname, "..");
const catalogPath = resolve(root, "data/foreign-tech-blogs.json");
const publicPath = resolve(root, "public/data/foreign-updates.json");
const appPath = resolve(root, "app/generated/foreign-updates.json");
const markdownPath = resolve(root, "research/13-foreign-tech-blogs/LATEST.md");
const botToken = "uiux-trend-atlas";
const botUserAgent = `${botToken}/1.1 (+https://github.com/iftype/uiux-trend-atlas/blob/main/BOT_POLICY.md)`;
const robotsCache = new Map();

class RobotsPolicyError extends Error {
  constructor(message, audit) {
    super(message);
    this.name = "RobotsPolicyError";
    this.audit = audit;
  }
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const previous = await readJson(publicPath, { sources: [], articles: [] });
const previousBySource = new Map(previous.sources.map((source) => [source.id, source]));

const uxKeywords = [
  "accessib", "animation", "canvas", "client", "color", "component", "content design",
  "anchor positioning", "baseline", "browser", "css", "dark mode", "design", "devtools",
  "experiment", "font", "frontend", "front-end", "gesture", "html", "haptic", "homepage",
  "interaction", "interface", "javascript", "mobile", "motion",
  "personalization", "prototype", "recommend", "research", "search", "spatial",
  "typography", "user experience", "user interface", "ux", "viewport", "visual",
  "view transition", "web api", "web platform", "web performance", "webview", "webkit",
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
  "frontend-platform": ["baseline", "browser", "css", "html", "javascript", "web api", "web platform", "view transition", "anchor positioning"],
  "webview-hybrid": ["webview", "web view", "webkit", "wkwebview", "webview2", "native bridge", "jsbridge", "viewport"],
  "accessibility-performance": ["accessibility", "core web vital", "inp", "lcp", "cls", "performance", "devtools", "wcag"],
};

const feedSources = catalog.filter((source) => source.feed);
const settled = await collectSources(feedSources);
const successful = settled.filter((source) => source.status === "ok").length;

if (successful === 0) {
  throw new Error("Every configured feed failed. Existing data was left untouched.");
}

const allArticles = settled
  .flatMap((source) => source.articles.map((article) => ({ ...article, sourceId: source.id, source: source.name, company: source.company })))
  .sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));
const uniqueArticles = dedupeByUrl(allArticles).slice(0, 240);

const output = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  collectionPolicy: "metadata-only",
  stats: {
    catalogSources: catalog.length,
    feedSources: feedSources.length,
    healthyFeeds: successful,
    robotsAllowedFeeds: settled.filter((source) => source.robots?.status === "allowed").length,
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
  let robots;
  try {
    const result = await fetchFeedWithPolicy(source.feed, 18_000);
    robots = result.robots;
    const response = result.response;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const feedItems = parseFeed(xml);
    if (feedItems.length === 0) throw new Error("No feed items parsed");
    const parsed = feedItems
      .filter((article) => source.feedMode === "all" || isUxRelevant(article))
      .map((article) => ({ ...article, topics: classify(article, source.topics) }))
      .filter((article) => article.url && article.title)
      .map(toPublicArticle)
      .slice(0, 12);

    return {
      id: source.id,
      company: source.company,
      name: source.name,
      url: source.url,
      feed: source.feed,
      status: "ok",
      checkedAt: new Date().toISOString(),
      robots,
      articles: parsed,
    };
  } catch (error) {
    console.warn(`Feed failed: ${source.name} — ${error instanceof Error ? error.message : String(error)}`);
    return {
      id: source.id,
      company: source.company,
      name: source.name,
      url: source.url,
      feed: source.feed,
      status: "stale",
      checkedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      robots: error instanceof RobotsPolicyError ? error.audit : robots ?? prior?.robots ?? { status: "unknown" },
      articles: error instanceof RobotsPolicyError ? [] : sanitizeArticles(prior?.articles ?? []),
    };
  }
}

async function collectSources(sources) {
  const groups = new Map();
  sources.forEach((source, index) => {
    const origin = new URL(source.feed).origin;
    if (!groups.has(origin)) groups.set(origin, []);
    groups.get(origin).push({ source, index });
  });

  const queues = [...groups.values()];
  const results = new Array(sources.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < queues.length) {
      const queue = queues[cursor++];
      for (const { source, index } of queue) {
        results[index] = await updateSource(source);
        await delay(350);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, queues.length) }, worker));
  return results;
}

async function fetchFeedWithPolicy(initialUrl, timeout) {
  let currentUrl = new URL(initialUrl);
  const checks = [];

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    const check = await checkRobots(currentUrl, timeout);
    checks.push(check.audit);
    if (!check.allowed) {
      throw new RobotsPolicyError(`robots.txt policy denied ${currentUrl.origin}`, makeRobotsAudit("blocked", currentUrl, checks));
    }

    const response = await request(currentUrl, timeout);
    if (!isRedirect(response.status)) {
      return { response, robots: makeRobotsAudit("allowed", currentUrl, checks) };
    }

    const location = response.headers.get("location");
    if (!location) throw new Error(`HTTP ${response.status} redirect missing Location`);
    currentUrl = new URL(location, currentUrl);
  }

  throw new RobotsPolicyError("Feed exceeded the five-redirect safety limit", makeRobotsAudit("blocked", currentUrl, checks));
}

async function checkRobots(targetUrl, timeout) {
  const document = await getRobotsDocument(targetUrl.origin, timeout);
  if (document.mode === "blocked") {
    return { allowed: false, audit: auditCheck(targetUrl, document, null) };
  }
  if (document.mode === "missing") {
    return { allowed: true, audit: auditCheck(targetUrl, document, null) };
  }

  const decision = evaluateRobots(document.text, targetUrl, botToken);
  return { allowed: decision.allowed, audit: auditCheck(targetUrl, document, decision.matchedRule) };
}

async function getRobotsDocument(origin, timeout) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);

  const promise = (async () => {
    let robotsUrl = new URL("/robots.txt", origin);
    for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
      try {
        const response = await request(robotsUrl, timeout);
        if (isRedirect(response.status)) {
          const location = response.headers.get("location");
          if (!location) return robotsDocument("blocked", robotsUrl, response.status, "redirect-without-location");
          robotsUrl = new URL(location, robotsUrl);
          continue;
        }
        if (response.ok) {
          const text = (await response.text()).slice(0, 512_000);
          return { ...robotsDocument("rules", robotsUrl, response.status, "rules-found"), text };
        }
        if (response.status === 404 || response.status === 410) {
          return robotsDocument("missing", robotsUrl, response.status, "not-published");
        }
        if (response.status >= 400 && response.status < 500 && ![401, 403, 429].includes(response.status)) {
          return robotsDocument("missing", robotsUrl, response.status, "rfc9309-unavailable");
        }
        return robotsDocument("blocked", robotsUrl, response.status, "unreachable-or-restricted");
      } catch (error) {
        return robotsDocument("blocked", robotsUrl, null, error instanceof Error ? error.message : String(error));
      }
    }
    return robotsDocument("blocked", robotsUrl, null, "redirect-limit");
  })();

  robotsCache.set(origin, promise);
  return promise;
}

async function request(url, timeout) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          accept: "application/atom+xml, application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.1",
          "user-agent": botUserAgent,
        },
      });
      if (![429, 503].includes(response.status) || attempt === 1) return response;
      await response.body?.cancel();
      await delay(retryDelay(response.headers.get("retry-after")));
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("Request retry loop ended unexpectedly");
}

function retryDelay(value) {
  if (!value) return 1_500;
  const seconds = Number(value);
  const milliseconds = Number.isFinite(seconds) ? seconds * 1_000 : Date.parse(value) - Date.now();
  return Math.min(15_000, Math.max(0, milliseconds || 1_500));
}

function isRedirect(status) {
  return [301, 302, 303, 307, 308].includes(status);
}

function robotsDocument(mode, url, httpStatus, reason) {
  return { mode, url: url.toString(), httpStatus, reason, checkedAt: new Date().toISOString() };
}

function auditCheck(targetUrl, document, matchedRule) {
  return {
    origin: targetUrl.origin,
    robotsUrl: document.url,
    httpStatus: document.httpStatus,
    decision: document.mode === "blocked" ? "blocked" : "allowed",
    reason: matchedRule ?? document.reason,
    checkedAt: document.checkedAt,
  };
}

function makeRobotsAudit(status, finalUrl, checks) {
  return {
    status,
    checkedAt: checks.at(-1)?.checkedAt ?? new Date().toISOString(),
    finalFeedUrl: finalUrl.toString(),
    checks,
  };
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
    return { title, url, publishedAt, feedText: description.slice(0, 2_000) };
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
  const strictSummary = article.feedText.toLowerCase();
  const titleMatch = uxKeywords.some((keyword) => wordMatch(title, keyword));
  const summaryPhrases = [
    "accessibility", "design system", "interaction design", "user experience",
    "user interface", "content design", "frontend", "front-end", "web performance",
    "mobile app", "client-side", "client experience", "web platform", "web api",
    "core web vital", "view transition", "scroll-driven", "webview", "webkit",
  ];
  return titleMatch || summaryPhrases.some((phrase) => strictSummary.includes(phrase));
}

function classify(article, fallback = []) {
  const haystack = `${article.title} ${article.feedText}`.toLowerCase();
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

function toPublicArticle(article) {
  return {
    title: article.title,
    url: article.url,
    publishedAt: article.publishedAt,
    topics: article.topics,
  };
}

function sanitizeArticles(articles) {
  return articles.map((article) => toPublicArticle({
    ...article,
    topics: Array.isArray(article.topics) ? article.topics : [],
  }));
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
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
    `자동 갱신: **${data.generatedAt.slice(0, 10)}** · 정상 피드 **${data.stats.healthyFeeds}/${data.stats.feedSources}** · robots 허용 **${data.stats.robotsAllowedFeeds}/${data.stats.feedSources}** · 수집 글 **${data.articles.length}개**`,
    "",
    "> 이 문서는 GitHub Actions가 공식 RSS/Atom 피드의 제목·링크·발행일만 수집해 생성합니다. 본문은 복제하지 않습니다.",
    "",
    "| 발행일 | 출처 | 글 | 연결 주제 |",
    "|---|---|---|---|",
  ];
  for (const article of data.articles.slice(0, 200)) {
    const date = article.publishedAt?.slice(0, 10) ?? "날짜 없음";
    const topics = article.topics.map((topic) => `\`${topic}\``).join(" ");
    lines.push(`| ${date} | ${escapeMd(article.source)} | [${escapeMd(article.title)}](${article.url}) | ${topics} |`);
  }
  lines.push("", "## Feed health", "", "| 출처 | 상태 | robots.txt | 확인 시각 |", "|---|---|---|---|");
  for (const source of data.sources) {
    lines.push(`| [${escapeMd(source.name)}](${source.url}) | ${source.status} | ${source.robots?.status ?? "unknown"} | ${source.checkedAt.slice(0, 16).replace("T", " ")} UTC |`);
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
