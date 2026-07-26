"use client";

import { useEffect, useMemo, useState } from "react";
import { koreanCases, microRepos, trends } from "./data";
import foreignCatalog from "../data/foreign-tech-blogs.json";
import frontendGuide from "../data/frontend-webview-2026.json";
import foreignUpdates from "./generated/foreign-updates.json";

const frontendTopics = new Set(["frontend-platform", "webview-hybrid", "accessibility-performance"]);

const categories = ["전체", "콘텐츠", "모션", "몰입", "신뢰", "행동"] as const;
const categoryMap: Record<(typeof categories)[number], string[]> = {
  전체: trends.map((trend) => trend.id),
  콘텐츠: ["realtime-content", "personalization"],
  모션: ["immersive-scrolling", "3d-graphics-animation", "kinetic-typography", "microinteractions"],
  몰입: ["bold-color", "3d-graphics-animation", "ar-vr", "dark-mode"],
  신뢰: ["biometric-auth", "personalization", "sustainable-design", "dark-mode"],
  행동: ["gamification", "microinteractions", "realtime-content"],
};

export function TrendAtlas() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const [read, setRead] = useState<string[]>([]);
  const [time, setTime] = useState("");

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
        <a className="brand" href="#top" aria-label="Trend Atlas 처음으로">UI/UX<br />TREND ATLAS</a>
        <div className="live" aria-label={`현재 시각 ${time}`}><i /> LIVE · {time}</div>
        <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="색상 테마 전환">
          {theme === "dark" ? "LIGHT" : "DARK"} ↗
        </button>
      </header>

      <section className="hero" id="top">
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
        <a className="scroll-cue" href="#index"><span>SCROLL TO EXPLORE</span><b>↓</b></a>
      </section>

      <section className="index" id="index">
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
            <a className="topic-card" href={`#${trend.id}`} key={trend.id} style={{ "--accent": trend.color } as React.CSSProperties}>
              <span className="topic-no">{trend.no}</span>
              <div>
                <small>{trend.english}</small>
                <h3>{trend.title}</h3>
                <p>{trend.summary}</p>
              </div>
              <span className="arrow">↘</span>
            </a>
          ))}
        </div>
        {filtered.length === 0 && <p className="empty">일치하는 흐름이 없습니다. 다른 검색어를 입력해 보세요.</p>}
      </section>

      <section className="deep-dive">
        <div className="section-heading inverse">
          <p>02 / FIELD NOTES</p>
          <h2>리서치 노트</h2>
          <span>{read.length}/{trends.length} READ</span>
        </div>
        {trends.map((trend) => (
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
              <div><h3>대표 패턴</h3><ul>{trend.patterns.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3>실무 체크</h3><ul>{trend.checklist.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3>주의할 점</h3><ul>{trend.risks.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <div className="sources">
              <h3>SOURCE TRAIL</h3>
              {trend.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                  <span>{source.label}</span><small>{source.note}</small><b>↗</b>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="micro-lab" id="micro-lab">
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
              <div><code>{repo.repo}</code><b>★ {repo.stars} ↗</b></div>
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
      </section>

      <section className="foreign-watch" id="foreign-watch">
        <div className="section-heading">
          <p>04 / GLOBAL WATCH</p>
          <h2>해외 제품 팀이 남긴 기록</h2>
          <span>AUTO UPDATED</span>
        </div>
        <div className="pipeline-status">
          <div>
            <i />
            <span>PIPELINE HEALTHY</span>
          </div>
          <p>
            공식 피드 <b>{foreignUpdates.stats.healthyFeeds}/{foreignUpdates.stats.feedSources}</b> 정상
            <span>·</span>
            최신 글 <b>{foreignUpdates.stats.articles}</b>개
            <span>·</span>
            마지막 수집 <b>{foreignUpdates.generatedAt.slice(0, 10)}</b>
          </p>
          <a href="https://github.com/iftype/uiux-trend-atlas/actions/workflows/update-research.yml" target="_blank" rel="noreferrer">ACTION LOG ↗</a>
        </div>

        <div className="subheading global-latest">
          <h3>Latest from the field</h3>
          <p>공식 RSS/Atom에서 제목·링크·발행일만 가져옵니다. 각 카드는 반드시 기업 원문으로 연결됩니다.</p>
        </div>
        <div className="article-grid">
          {foreignUpdates.articles.slice(0, 18).map((article, index) => (
            <a href={article.url} target="_blank" rel="noreferrer" className="article-card" key={article.url}>
              <div>
                <span>{article.publishedAt?.slice(0, 10) ?? "DATE N/A"}</span>
                <b>{String(index + 1).padStart(2, "0")}</b>
              </div>
              <small>{article.company} / {article.source}</small>
              <h4>{article.title}</h4>
              <p>{article.summary}</p>
              <div className="article-meta">
                <div>{article.topics.slice(0, 2).map((topic) => <em key={topic}>{topic}</em>)}</div>
                <b>READ ↗</b>
              </div>
            </a>
          ))}
        </div>

        <div className="subheading global-directory">
          <h3>Official directory</h3>
          <p>디자인 블로그뿐 아니라 디자인 시스템과 실제 클라이언트 구현을 다루는 엔지니어링 채널을 함께 봅니다.</p>
        </div>
        <div className="foreign-directory">
          {foreignCatalog.map((source, index) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{source.region} · {source.company}</small><h4>{source.name}</h4></div>
              <p>{source.note}</p>
              <div className="focus-tags">{source.focus.slice(0, 2).map((focus) => <em key={focus}>{focus}</em>)}</div>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="frontend-guide" id="frontend-webview">
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
                  <b>↗</b>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="principles">
        <div className="section-heading inverse">
          <p>06 / DECISION FILTER</p>
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
      </section>

      <footer>
        <p>UI/UX TREND ATLAS</p>
        <div><span>Research snapshot</span><b>2026.07.26</b></div>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
