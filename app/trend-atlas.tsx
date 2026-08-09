"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { koreanCases, microRepos, trends, type Source } from "./data";
import foreignCatalog from "../data/foreign-tech-blogs.json";
import frontendGuide from "../data/frontend-webview-2026.json";
import openSourceStack from "../data/open-source-stack.json";
import foreignUpdates from "./generated/foreign-updates.json";

const frontendTopics = new Set(["frontend-platform", "webview-hybrid", "accessibility-performance"]);
const articlePageSize = 6;
const sourcePageSize = 10;
const ossPageSize = 6;

export type AtlasView = "home" | "trends" | "trend" | "micro" | "global" | "sources" | "guide" | "samples" | "opensource";

const routeNavigation: { view: AtlasView; label: string; href: string }[] = [
  { view: "home", label: "HOME", href: "/" },
  { view: "trends", label: "12 TRENDS", href: "/trends/" },
  { view: "micro", label: "MICRO", href: "/microinteractions/" },
  { view: "global", label: "GLOBAL", href: "/global/" },
  { view: "guide", label: "2026 GUIDE", href: "/field-guide/" },
  { view: "samples", label: "SAMPLES", href: "/samples/" },
  { view: "opensource", label: "OPEN SOURCE", href: "/open-source/" },
];

const pageDirectory = [
  { no: "01", href: "/trends/", title: "12 UI/UX 트렌드", copy: "트렌드 목록에서 한 주제씩 독립된 리서치 노트로 읽습니다.", meta: "12 NOTES" },
  { no: "02", href: "/microinteractions/", title: "마이크로인터랙션", copy: "작동 샘플, 국내 기업 사례와 공개 저장소를 모았습니다.", meta: "CASES + DEMOS" },
  { no: "03", href: "/global/", title: "글로벌 아티클", copy: "공식 기술 블로그 최신 글을 6개씩 넘겨가며 탐색합니다.", meta: "AUTO UPDATED" },
  { no: "04", href: "/field-guide/", title: "2026 WebView 가이드", copy: "브라우저와 앱 컨테이너를 함께 다루는 출시 기준입니다.", meta: "FIELD GUIDE" },
  { no: "05", href: "/samples/", title: "실행 샘플·스킬", copy: "직접 눌러보는 UI 샘플과 결과물 중심 스킬 맵입니다.", meta: "INTERACTIVE" },
  { no: "06", href: "/open-source/", title: "오픈소스 스택", copy: "용도, 주의점, 라이선스를 비교해 필요한 도구를 고릅니다.", meta: "23 PROJECTS" },
];

const categories = ["전체", "콘텐츠", "모션", "몰입", "신뢰", "행동"] as const;
const categoryMap: Record<(typeof categories)[number], string[]> = {
  전체: trends.map((trend) => trend.id),
  콘텐츠: ["realtime-content", "personalization"],
  모션: ["immersive-scrolling", "3d-graphics-animation", "kinetic-typography", "microinteractions"],
  몰입: ["bold-color", "3d-graphics-animation", "ar-vr", "dark-mode"],
  신뢰: ["biometric-auth", "personalization", "sustainable-design", "dark-mode"],
  행동: ["gamification", "microinteractions", "realtime-content"],
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "official source";
  }
}

function ReferenceList({ items, sources, offset = 0 }: { items: string[]; sources: Source[]; offset?: number }) {
  return (
    <ul>
      {items.map((item, index) => {
        const source = sources[(index + offset) % sources.length];
        return (
          <li key={item}>
            <a href={source.url} target="_blank" rel="noreferrer" aria-label={`${item} 관련 원문: ${source.label}`}>
              <span>{item}</span>
              <small>{source.label} · 관련 원문 ↗</small>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Pagination({ page, total, onChange, label }: { page: number; total: number; onChange: (page: number) => void; label: string }) {
  if (total <= 1) return null;
  const candidates = total <= 7
    ? Array.from({ length: total }, (_, index) => index + 1)
    : [...new Set([1, page - 1, page, page + 1, total].filter((item) => item >= 1 && item <= total))];

  return (
    <nav className="pagination" aria-label={label}>
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>← 이전</button>
      <div>
        {candidates.map((item, index) => (
          <span key={item}>
            {index > 0 && item - candidates[index - 1] > 1 && <i aria-hidden="true">…</i>}
            <button type="button" className={item === page ? "active" : ""} aria-current={item === page ? "page" : undefined} onClick={() => onChange(item)}>{item}</button>
          </span>
        ))}
      </div>
      <button type="button" disabled={page === total} onClick={() => onChange(page + 1)}>다음 →</button>
    </nav>
  );
}

export function TrendAtlas({ view = "home", trendId }: { view?: AtlasView; trendId?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const [read, setRead] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [ossCategory, setOssCategory] = useState("ALL");
  const [articleTopic, setArticleTopic] = useState("ALL");
  const [articlePage, setArticlePage] = useState(1);
  const [sourcePage, setSourcePage] = useState(1);
  const [ossPage, setOssPage] = useState(1);
  const [saveDemo, setSaveDemo] = useState<"idle" | "loading" | "saved">("idle");
  const [keyboardDemo, setKeyboardDemo] = useState(false);
  const [bridgeStep, setBridgeStep] = useState(0);
  const sampleDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("atlas-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedRead = localStorage.getItem("atlas-read");
    const tick = () => setTime(new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()));
    const initial = window.requestAnimationFrame(() => {
      setTheme(storedTheme === "dark" || (!storedTheme && prefersDark) ? "dark" : "light");
      if (storedRead) setRead(JSON.parse(storedRead));
      tick();
    });
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.cancelAnimationFrame(initial);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("atlas-theme", theme);
  }, [theme]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return trends.filter((trend) => {
      const categoryMatch = categoryMap[category].includes(trend.id);
      const queryMatch = !normalized || [trend.title, trend.english, trend.summary, ...trend.patterns].join(" ").toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);
  const frontendArticles = foreignUpdates.articles
    .filter((article) => article.topics.some((topic) => frontendTopics.has(topic)))
    .slice(0, 12);
  const articleTopics = ["ALL", ...new Set(foreignUpdates.articles.flatMap((article) => article.topics))];
  const filteredArticles = articleTopic === "ALL"
    ? foreignUpdates.articles
    : foreignUpdates.articles.filter((article) => article.topics.includes(articleTopic));
  const articlePageCount = Math.max(1, Math.ceil(filteredArticles.length / articlePageSize));
  const visibleArticles = filteredArticles.slice((articlePage - 1) * articlePageSize, articlePage * articlePageSize);
  const sourcePageCount = Math.max(1, Math.ceil(foreignCatalog.length / sourcePageSize));
  const visibleSources = foreignCatalog.slice((sourcePage - 1) * sourcePageSize, sourcePage * sourcePageSize);
  const ossCategories = ["ALL", ...new Set(openSourceStack.projects.map((project) => project.category))];
  const filteredProjects = ossCategory === "ALL"
    ? openSourceStack.projects
    : openSourceStack.projects.filter((project) => project.category === ossCategory);
  const ossPageCount = Math.max(1, Math.ceil(filteredProjects.length / ossPageSize));
  const visibleProjects = filteredProjects.slice((ossPage - 1) * ossPageSize, ossPage * ossPageSize);
  const selectedTrendIndex = trends.findIndex((trend) => trend.id === trendId);
  const selectedTrend = selectedTrendIndex >= 0 ? trends[selectedTrendIndex] : trends[0];

  const changePage = (setter: (page: number) => void, nextPage: number, targetId: string) => {
    setter(nextPage);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleRead = (id: string) => {
    setRead((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("atlas-read", JSON.stringify(next));
      return next;
    });
  };

  return (
    <main>
      <div className="reading-line" style={{ transform: `scaleX(${read.length / trends.length})` }} />
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Trend Atlas 처음으로">UI/UX<br />TREND ATLAS</Link>
        <div className="live" aria-label={`현재 시각 ${time}`}><i /> LIVE · {time}</div>
        <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="색상 테마 전환">
          {theme === "dark" ? "LIGHT" : "DARK"} ↗
        </button>
      </header>

      <nav className="page-nav" aria-label="주요 페이지">
        {routeNavigation.map((item) => {
          const active = item.view === view || (view === "trend" && item.view === "trends") || (view === "sources" && item.view === "global");
          return <Link href={item.href} key={item.view} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{item.label}</Link>;
        })}
      </nav>

      {view === "home" && <section className="hero" id="top">
        <div className="eyebrow">FIELD NOTES / 2026 EDITION</div>
        <h1>
          <span>지금,</span>
          <span className="outline">인터페이스는</span>
          <span>어떻게 움직이는가?</span>
        </h1>
        <p className="hero-copy">12개의 UI/UX 흐름과 2026 프론트엔드·WebView 출시 기준을 실제 구현 문서로 연결한 살아있는 정보 레포.</p>
        <div className="hero-meta">
          <span>12 TOPICS</span><span>{foreignCatalog.length} GLOBAL SOURCES</span><span>WEBVIEW 2026</span><span>AUTO UPDATED</span>
        </div>
        <a className="scroll-cue" href="#pages"><span>CHOOSE A PAGE</span><b>↓</b></a>
      </section>}

      {view === "home" && <section className="page-directory" id="pages">
        <div className="section-heading">
          <p>01 / PAGES</p>
          <h2>필요한 만큼만 읽기</h2>
          <span>6 SECTIONS</span>
        </div>
        <p className="page-directory-intro">하나의 긴 문서를 목적별 페이지로 나눴습니다. 트렌드 노트는 한 주제씩, 목록형 자료는 번호로 넘겨가며 볼 수 있습니다.</p>
        <div className="page-grid">
          {pageDirectory.map((item) => (
            <Link href={item.href} className="page-card" key={item.href}>
              <div><span>{item.no}</span><small>{item.meta}</small></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <b>페이지 열기 ↗</b>
            </Link>
          ))}
        </div>
      </section>}

      {view === "trends" && <section className="index" id="top">
        <div className="section-heading">
          <p>01 / INDEX</p>
          <h2>탐색할 흐름</h2>
          <span>{filtered.length.toString().padStart(2, "0")} RESULTS</span>
        </div>

        <div className="tools">
          <label className="search">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="키워드 검색" aria-label="트렌드 검색" />
          </label>
          <div className="chips" aria-label="카테고리 필터">
            {categories.map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="topic-grid">
          {filtered.map((trend) => (
            <Link className="topic-card" href={`/trends/${trend.id}/`} key={trend.id} style={{ "--accent": trend.color } as React.CSSProperties}>
              <span className="topic-no">{trend.no}</span>
              <div>
                <small>{trend.english}</small>
                <h3>{trend.title}</h3>
                <p>{trend.summary}</p>
              </div>
              <span className="arrow">↘</span>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p className="empty">일치하는 흐름이 없습니다. 다른 검색어를 입력해 보세요.</p>}
      </section>}

      {view === "trend" && <section className="deep-dive" id="top">
        <div className="section-heading inverse">
          <p>02 / FIELD NOTES</p>
          <h2>리서치 노트</h2>
          <span>{selectedTrend.no} / {trends.length.toString().padStart(2, "0")}</span>
        </div>
        {[selectedTrend].map((trend) => (
          <article className="trend" id={trend.id} key={trend.id} style={{ "--accent": trend.color } as React.CSSProperties}>
            <div className="trend-title">
              <span>{trend.no}</span>
              <div><small>{trend.english}</small><h2>{trend.title}</h2></div>
              <button className={read.includes(trend.id) ? "checked" : ""} onClick={() => toggleRead(trend.id)} aria-pressed={read.includes(trend.id)}>
                {read.includes(trend.id) ? "✓ 읽음" : "○ 읽음 표시"}
              </button>
            </div>
            <p className="trend-summary">{trend.summary}</p>
            <blockquote>{trend.signal}</blockquote>
            <div className="note-columns">
              <div><h3>대표 패턴</h3><ReferenceList items={trend.patterns} sources={trend.sources} /></div>
              <div><h3>실무 체크</h3><ReferenceList items={trend.checklist} sources={trend.sources} offset={1} /></div>
              <div><h3>주의할 점</h3><ReferenceList items={trend.risks} sources={trend.sources} offset={2} /></div>
            </div>
            <div className="sources">
              <h3>SOURCE TRAIL</h3>
              {trend.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                  <span>{source.label}</span><small>{source.note}</small><b>원문 ↗</b>
                </a>
              ))}
            </div>
          </article>
        ))}
        <nav className="trend-pager" aria-label="트렌드 앞뒤 페이지">
          {selectedTrendIndex > 0 ? <Link href={`/trends/${trends[selectedTrendIndex - 1].id}/`}><small>← 이전 노트</small><b>{trends[selectedTrendIndex - 1].title}</b></Link> : <span />}
          <Link className="all-trends" href="/trends/">12개 목록</Link>
          {selectedTrendIndex < trends.length - 1 ? <Link href={`/trends/${trends[selectedTrendIndex + 1].id}/`}><small>다음 노트 →</small><b>{trends[selectedTrendIndex + 1].title}</b></Link> : <span />}
        </nav>
      </section>}

      {view === "micro" && <section className="micro-lab" id="top">
        <div className="section-heading">
          <p>03 / MICRO LAB</p>
          <h2>작지만 결정적인 것들</h2>
          <span>CURATED</span>
        </div>
        <div className="micro-intro">
          <p>마이크로인터랙션은 <b>트리거</b>에 반응해 <b>규칙</b>을 실행하고, 즉시 <b>피드백</b>을 주며, 반복될 때의 <b>루프와 모드</b>를 가진다.</p>
          <div className="demo-row" aria-label="마이크로인터랙션 예시">
            <button className="demo-like" onClick={(event) => event.currentTarget.classList.toggle("liked")}>♥ <span>LIKE</span></button>
            <button className="demo-save" onClick={(event) => event.currentTarget.classList.toggle("saved")}><i /> <span>SAVE</span></button>
            <button className="demo-send" onClick={(event) => { const button = event.currentTarget; button.classList.add("sent"); window.setTimeout(() => button.classList.remove("sent"), 1400); }}><span>SEND</span><b>→</b></button>
          </div>
        </div>

        <div className="subheading"><h3>오픈소스 샘플 레포</h3><p>별표 수는 2026-07-26 조사 시점의 대략값. 도입 전 라이선스와 최근 유지보수 상태를 다시 확인하세요.</p></div>
        <div className="repo-grid">
          {microRepos.map((repo, index) => (
            <a href={repo.url} target="_blank" rel="noreferrer" className="repo-card" key={repo.repo}>
              <span className="repo-index">{String(index + 1).padStart(2, "0")}</span>
              <small>{repo.tag}</small>
              <h4>{repo.name}</h4>
              <p>{repo.note}</p>
              <div><code>{repo.repo}</code><b>★ {repo.stars} · 저장소 ↗</b></div>
            </a>
          ))}
        </div>

        <div className="subheading korean"><h3>국내 기업 공개 사례</h3><p>홍보성 2차 자료보다 기업이 직접 공개한 글과 디자인 시스템을 우선했습니다.</p></div>
        <div className="case-list">
          {koreanCases.map((item) => (
            <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>
              <span>{item.company}</span>
              <h4>{item.title}</h4>
              <p>{item.takeaway}</p>
              <b>원문 ↗</b>
            </a>
          ))}
        </div>
      </section>}

      {(view === "global" || view === "sources") && <section className="foreign-watch" id="top">
        <div className="section-heading">
          <p>{view === "global" ? "04 / GLOBAL WATCH" : "04B / SOURCE DIRECTORY"}</p>
          <h2>{view === "global" ? "해외 제품 팀이 남긴 기록" : "공식 채널 디렉터리"}</h2>
          <span>{view === "global" ? "AUTO UPDATED" : `${foreignCatalog.length} SOURCES`}</span>
        </div>
        {view === "global" && <>
        <div className="pipeline-status">
          <div>
            <i />
            <span>{foreignUpdates.stats.healthyFeeds === foreignUpdates.stats.feedSources ? "PIPELINE HEALTHY" : "PIPELINE PARTIAL"}</span>
          </div>
          <p>
            공식 피드 <b>{foreignUpdates.stats.healthyFeeds}/{foreignUpdates.stats.feedSources}</b> 정상
            <span>·</span>
            robots 허용 <b>{foreignUpdates.stats.robotsAllowedFeeds}/{foreignUpdates.stats.feedSources}</b>
            <span>·</span>
            최신 글 <b>{foreignUpdates.stats.articles}</b>개
            <span>·</span>
            마지막 수집 <b>{foreignUpdates.generatedAt.slice(0, 10)}</b>
          </p>
          <a href="https://github.com/iftype/uiux-trend-atlas/actions/workflows/update-research.yml" target="_blank" rel="noreferrer">ACTION LOG ↗</a>
        </div>

        <div className="subheading global-latest">
          <h3>Latest from the field</h3>
          <p>매 수집 시 robots.txt를 확인하고 공식 RSS/Atom의 제목·링크·발행일만 보관합니다. 출처 도메인과 원문 링크를 모든 카드에 표시합니다.</p>
        </div>
        <div className="article-library-tools">
          <div className="article-filters" aria-label="아티클 주제 필터">
            {articleTopics.map((topic) => (
              <button
                type="button"
                key={topic}
                className={articleTopic === topic ? "active" : ""}
                onClick={() => {
                  setArticleTopic(topic);
                  setArticlePage(1);
                }}
              >
                {topic}
              </button>
            ))}
          </div>
          <span>PAGE {articlePage} / {articlePageCount} · {filteredArticles.length} ARTICLES</span>
        </div>
        <div className="article-grid">
          {visibleArticles.map((article, index) => (
            <a href={article.url} target="_blank" rel="noreferrer" className="article-card" key={article.url}>
              <div>
                <span>{article.publishedAt?.slice(0, 10) ?? "DATE N/A"}</span>
                <b>{String((articlePage - 1) * articlePageSize + index + 1).padStart(2, "0")}</b>
              </div>
              <small>{article.company} / {article.source}</small>
              <h4>{article.title}</h4>
              <p>{article.company} 공식 채널의 원문으로 이동합니다. 외부 본문과 요약문은 저장하지 않습니다.</p>
              <div className="article-meta">
                <div className="article-tags">{article.topics.slice(0, 2).map((topic) => <em key={topic}>{topic}</em>)}</div>
                <span className="article-link"><small>{getDomain(article.url)}</small><b>원문 읽기 ↗</b></span>
              </div>
            </a>
          ))}
        </div>
        <Pagination page={articlePage} total={articlePageCount} label="글 목록 페이지" onChange={(nextPage) => changePage(setArticlePage, nextPage, "top")} />
        <div className="related-page">
          <div><small>OFFICIAL DIRECTORY</small><h3>어떤 팀의 글인지 먼저 보고 싶다면</h3></div>
          <Link href="/sources/">{foreignCatalog.length}개 공식 채널 보기 ↗</Link>
        </div>
        </>}

        {view === "sources" && <>
        <div className="subheading global-directory" id="source-list">
          <h3>Official directory</h3>
          <p>디자인 블로그뿐 아니라 디자인 시스템과 실제 클라이언트 구현을 다루는 엔지니어링 채널을 함께 봅니다.</p>
        </div>
        <div className="foreign-directory">
          {visibleSources.map((source, index) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
              <span>{String((sourcePage - 1) * sourcePageSize + index + 1).padStart(2, "0")}</span>
              <div><small>{source.region} · {source.company}</small><h4>{source.name}</h4></div>
              <p>{source.note}</p>
              <div className="focus-tags">{source.focus.slice(0, 2).map((focus) => <em key={focus}>{focus}</em>)}</div>
              <b>공식 사이트 ↗</b>
            </a>
          ))}
        </div>
        <Pagination page={sourcePage} total={sourcePageCount} label="공식 출처 목록 페이지" onChange={(nextPage) => changePage(setSourcePage, nextPage, "source-list")} />
        </>}
      </section>}

      {view === "guide" && <section className="frontend-guide" id="top">
        <div className="section-heading inverse">
          <p>05 / FRONTEND × WEBVIEW</p>
          <h2>브라우저 밖까지 설계하기</h2>
          <span>2026 FIELD GUIDE</span>
        </div>
        <div className="frontend-intro">
          <p>{frontendGuide.summary}</p>
          <div>
            <span>{frontendGuide.cards.length} RELEASE RULES</span>
            <span>{frontendGuide.testMatrix.length} TEST TARGETS</span>
            <a href="https://github.com/iftype/uiux-trend-atlas/tree/main/research/14-frontend-webview-2026" target="_blank" rel="noreferrer">FULL CHECKLIST ↗</a>
          </div>
        </div>

        <div className="webview-grid">
          {frontendGuide.cards.map((card, index) => (
            <article className={`webview-card status-${card.status.toLowerCase()}`} key={card.id}>
              <div className="webview-card-head">
                <span>{String(index + 1).padStart(2, "0")} · {card.area}</span>
                <b>{card.status}</b>
              </div>
              <h3>{card.title}</h3>
              <p>{card.summary}</p>
              <ul>
                {card.checks.map((check) => <li key={check}>{check}</li>)}
              </ul>
              <div className="webview-sources">
                {card.sources.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="webview-matrix">
          <div className="subheading inverse-subheading">
            <h3>최소 테스트 매트릭스</h3>
            <p>기기 이름보다 런타임·컨테이너·입력 조건을 분리해서 회귀 테스트합니다.</p>
          </div>
          <div className="matrix-list">
            {frontendGuide.testMatrix.map((row, index) => (
              <div key={row.target}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h4>{row.target}</h4>
                <p>{row.minimum}</p>
                <b>{row.focus}</b>
              </div>
            ))}
          </div>
        </div>

        {frontendArticles.length > 0 && (
          <div className="frontend-feed">
            <div className="subheading inverse-subheading">
              <h3>Platform radar</h3>
              <p>공식 브라우저·플랫폼 피드에서 자동 선별한 최신 프론트엔드 자료입니다.</p>
            </div>
            <div className="frontend-feed-list">
              {frontendArticles.map((article) => (
                <a href={article.url} target="_blank" rel="noreferrer" key={article.url}>
                  <span>{article.publishedAt?.slice(0, 10) ?? "DATE N/A"}</span>
                  <div><small>{article.company}</small><h4>{article.title}</h4></div>
                  <b>원문 읽기 ↗</b>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>}

      {(view === "samples" || view === "opensource") && <section className="sample-lab" id="top">
        <div className="section-heading">
          <p>{view === "samples" ? "06 / SAMPLE LAB" : "06B / OPEN SOURCE"}</p>
          <h2>{view === "samples" ? "보고, 눌러보고, 가져가기" : "검증된 도구를 골라 쓰기"}</h2>
          <span>{view === "samples" ? "INTERACTIVE" : `${openSourceStack.projects.length} PROJECTS`}</span>
        </div>

        {view === "samples" && <>
        <div className="sample-intro">
          <p>완성 화면만 구경하지 않고 상태·접근성·폴백이 들어간 최소 코드를 직접 실행하고 복사할 수 있습니다.</p>
          <a href="https://github.com/iftype/uiux-trend-atlas/tree/main/samples" target="_blank" rel="noreferrer">BROWSE ALL SAMPLES ↗</a>
        </div>

        <div className="interactive-samples">
          <article className="sample-card save-sample">
            <div><span>01 / ASYNC FEEDBACK</span><b>ARIA LIVE</b></div>
            <h3>저장 상태</h3>
            <button
              type="button"
              data-state={saveDemo}
              disabled={saveDemo === "loading"}
              onClick={() => {
                setSaveDemo("loading");
                window.setTimeout(() => setSaveDemo("saved"), 700);
              }}
              aria-describedby="save-demo-status"
            >
              {saveDemo === "idle" && "저장"}
              {saveDemo === "loading" && "저장 중…"}
              {saveDemo === "saved" && "저장됨 ✓"}
            </button>
            <p id="save-demo-status" role="status" aria-live="polite">
              {saveDemo === "loading" ? "변경사항을 저장하고 있습니다." : saveDemo === "saved" ? "변경사항을 저장했습니다." : "loading·success 상태를 눌러 확인하세요."}
            </p>
            <a href="https://github.com/iftype/uiux-trend-atlas/tree/main/samples/microinteraction-save" target="_blank" rel="noreferrer">샘플 코드 ↗</a>
          </article>

          <article className="sample-card dialog-sample">
            <div><span>02 / NATIVE DIALOG</span><b>FOCUS</b></div>
            <h3>접근 가능한 모달</h3>
            <button type="button" onClick={() => sampleDialog.current?.showModal()}>설정 열기</button>
            <p>브라우저의 focus trap·Escape·backdrop 동작을 기본값으로 사용합니다.</p>
            <a href="https://github.com/iftype/uiux-trend-atlas/tree/main/samples/accessible-dialog" target="_blank" rel="noreferrer">샘플 코드 ↗</a>
            <dialog ref={sampleDialog} aria-labelledby="sample-dialog-title">
              <form method="dialog">
                <h4 id="sample-dialog-title">알림 설정</h4>
                <p>필요한 알림만 받을 수 있습니다.</p>
                <label><input type="checkbox" /> 업데이트 알림 받기</label>
                <div><button value="cancel">취소</button><button value="save">저장</button></div>
              </form>
            </dialog>
          </article>

          <article className="sample-card viewport-sample">
            <div><span>03 / WEBVIEW LAYOUT</span><b>SAFE AREA</b></div>
            <h3>키보드 뷰포트</h3>
            <div className={`phone-demo ${keyboardDemo ? "keyboard-open" : ""}`}>
              <span>SAFE TOP</span>
              <main><input aria-label="샘플 메시지" placeholder="메시지" readOnly /></main>
              <div className="phone-cta">CTA</div>
              <i aria-hidden="true" />
            </div>
            <button type="button" aria-pressed={keyboardDemo} onClick={() => setKeyboardDemo(!keyboardDemo)}>
              {keyboardDemo ? "키보드 닫기" : "키보드 열기"}
            </button>
            <a href="https://github.com/iftype/uiux-trend-atlas/tree/main/samples/safe-area-layout" target="_blank" rel="noreferrer">샘플 코드 ↗</a>
          </article>

          <article className="sample-card bridge-sample">
            <div><span>04 / NATIVE BRIDGE</span><b>VERSIONED</b></div>
            <h3>메시지 계약</h3>
            <pre aria-live="polite"><code>{
              [
                '{ "version": 1, "state": "ready" }',
                '{ "id": "a1", "method": "auth.open" }',
                '{ "id": "a1", "ok": true }',
                '{ "state": "resolved", "elapsed": "84ms" }',
              ][bridgeStep]
            }</code></pre>
            <button type="button" onClick={() => setBridgeStep((bridgeStep + 1) % 4)}>다음 메시지 →</button>
            <a href="https://github.com/iftype/uiux-trend-atlas/tree/main/samples/webview-bridge" target="_blank" rel="noreferrer">샘플 코드 ↗</a>
          </article>
        </div>

        <div className="subheading skill-heading">
          <h3>Frontend skill map</h3>
          <p>도구 숙련도가 아니라 검증 가능한 결과물로 역량을 설명합니다.</p>
        </div>
        <div className="skill-grid">
          {openSourceStack.skills.map((skill, index) => (
            <article key={skill.id}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><b>{skill.level}</b></div>
              <h4>{skill.name}</h4>
              <p>{skill.summary}</p>
              <ul>{skill.learn.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="skill-proof"><small>PROOF PROJECT</small><strong>{skill.proof}</strong></div>
              <div className="skill-tools">{skill.tools.map((tool) => <em key={tool}>{tool}</em>)}</div>
            </article>
          ))}
        </div>
        <div className="related-page">
          <div><small>OPEN SOURCE STACK</small><h3>구현 도구와 라이선스를 비교하려면</h3></div>
          <Link href="/open-source/">23개 프로젝트 비교하기 ↗</Link>
        </div>
        </>}

        {view === "opensource" && <>
        <div className="subheading oss-heading">
          <h3>Open source stack</h3>
          <p>{openSourceStack.selectionNote} · {openSourceStack.verifiedAt} 확인</p>
        </div>
        <div className="oss-filters" aria-label="오픈소스 카테고리">
          {ossCategories.map((item) => (
            <button type="button" key={item} className={ossCategory === item ? "active" : ""} onClick={() => { setOssCategory(item); setOssPage(1); }}>{item}</button>
          ))}
        </div>
        <div className="oss-grid">
          {visibleProjects.map((project) => (
            <a href={project.url} target="_blank" rel="noreferrer" key={project.id}>
              <div className="oss-card-head">
                <span>{project.category}</span>
                <b className={`verdict-${project.verdict.toLowerCase()}`}>{project.verdict}</b>
              </div>
              <h4>{project.name}</h4>
              <code>{project.repo}</code>
              <p>{project.why}</p>
              <dl>
                <div><dt>BEST FOR</dt><dd>{project.bestFor}</dd></div>
                <div><dt>WATCH</dt><dd>{project.cautions}</dd></div>
              </dl>
              <div className="oss-meta">
                <span>★ {new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(project.stars)}</span>
                <span>{project.license}</span>
                <span>{project.latestRelease}</span>
                <b>저장소 열기 ↗</b>
              </div>
            </a>
          ))}
        </div>
        <Pagination page={ossPage} total={ossPageCount} label="오픈소스 목록 페이지" onChange={(nextPage) => changePage(setOssPage, nextPage, "top")} />
        </>}
      </section>}

      {view === "home" && <section className="principles">
        <div className="section-heading inverse">
          <p>07 / DECISION FILTER</p>
          <h2>유행보다 먼저 물을 것</h2>
          <span>5 QUESTIONS</span>
        </div>
        <ol>
          <li><span>01</span><p>이 표현은 사용자의 <b>목표 달성</b>을 더 쉽게 만드는가?</p></li>
          <li><span>02</span><p>느린 기기, 작은 화면, 키보드와 <b>보조기술</b>에서도 핵심이 남는가?</p></li>
          <li><span>03</span><p>움직임과 개인화를 사용자가 <b>줄이거나 끌 수</b> 있는가?</p></li>
          <li><span>04</span><p>효과가 사라져도 정보 구조와 브랜드가 <b>스스로 설 수</b> 있는가?</p></li>
          <li><span>05</span><p>클릭률뿐 아니라 이해도·완료율·장기 만족을 <b>측정</b>하는가?</p></li>
        </ol>
      </section>}

      <footer>
        <p>UI/UX TREND ATLAS</p>
        <div>
          <span>Research snapshot</span>
          <b>{foreignUpdates.generatedAt.slice(0, 10)}</b>
          <a href="https://github.com/iftype/uiux-trend-atlas/blob/main/LEGAL.md" target="_blank" rel="noreferrer">LEGAL &amp; ATTRIBUTION ↗</a>
          <a href="https://github.com/iftype/uiux-trend-atlas/blob/main/BOT_POLICY.md" target="_blank" rel="noreferrer">CRAWLER POLICY ↗</a>
        </div>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
