export type Source = {
  label: string;
  url: string;
  note: string;
};

export type Trend = {
  id: string;
  no: string;
  title: string;
  english: string;
  summary: string;
  signal: string;
  patterns: string[];
  checklist: string[];
  risks: string[];
  sources: Source[];
  color: string;
};

export const trends: Trend[] = [
  {
    id: "realtime-content",
    no: "01",
    title: "실시간 콘텐츠",
    english: "REAL-TIME CONTENT",
    summary: "가격·재고·상태·대화처럼 시간이 가치인 정보를 새로고침 없이 갱신한다.",
    signal: "핵심은 ‘빠름’보다 최신성, 연결 상태, 실패 복구를 사용자가 이해하게 만드는 것.",
    patterns: ["라이브 배지와 마지막 갱신 시각", "낙관적 UI와 되돌리기", "연결 끊김·재접속 상태", "읽던 위치를 보존하는 스트림"],
    checklist: ["SSE·WebSocket·폴링 중 데이터 흐름에 맞는 방식 선택", "새 콘텐츠를 갑자기 끼워 넣지 않고 알림으로 제어권 제공", "aria-live는 꼭 필요한 변화에만 사용"],
    risks: ["배터리·데이터 사용량", "업데이트로 인한 레이아웃 점프", "실시간처럼 보이는 오래된 데이터"],
    color: "#ff4d00",
    sources: [
      { label: "MDN · WebSocket API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", note: "양방향 연결의 기본과 주의점" },
      { label: "MDN · Server-sent events", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events", note: "서버→클라이언트 단방향 스트림" },
      { label: "Kakao Tech · 실시간 메시징", url: "https://tech.kakao.com/posts/679", note: "국내 대규모 메시징 성능 설계 사례" },
    ],
  },
  {
    id: "immersive-scrolling",
    no: "02",
    title: "몰입형 스크롤링",
    english: "IMMERSIVE SCROLL",
    summary: "스크롤을 단순 이동이 아니라 이야기의 시간축과 탐색 장치로 사용한다.",
    signal: "스크롤을 빼앗지 말고, 사용자의 속도를 존중하면서 장면과 정보의 관계를 보여준다.",
    patterns: ["스크롤 진행률", "스티키 챕터", "스크롤 기반 리빌", "가로 스냅 갤러리"],
    checklist: ["CSS Scroll-driven Animations를 우선 검토", "콘텐츠는 애니메이션 없이도 읽혀야 함", "키보드·뒤로가기·앵커 링크 보존"],
    risks: ["스크롤 재킹", "멀미를 유발하는 과도한 패럴랙스", "모바일 주소창·뷰포트 높이 변화"],
    color: "#6c5ce7",
    sources: [
      { label: "MDN · Scroll-driven animations", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations", note: "스크롤 타임라인 표준" },
      { label: "MDN · Scroll snap", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap", note: "네이티브 스냅 레이아웃" },
      { label: "W3C · Reduced motion", url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html", note: "상호작용 애니메이션 접근성" },
    ],
  },
  {
    id: "bold-color",
    no: "03",
    title: "대담한 색상 사용",
    english: "BOLD COLOR",
    summary: "고채도·강한 대비·예상 밖 조합으로 정보 위계와 브랜드 기억을 만든다.",
    signal: "색이 세다고 위계가 생기지는 않는다. 강조색의 역할과 사용량을 먼저 정한다.",
    patterns: ["한 개의 지배적 액센트", "컬러 블로킹", "상태별 시맨틱 컬러", "중립 배경 + 고채도 CTA"],
    checklist: ["텍스트 대비를 WCAG 기준으로 검사", "색만으로 상태를 전달하지 않기", "P3 색상은 sRGB 폴백 제공"],
    risks: ["넓은 면적의 시각 피로", "브랜드색과 상태색 충돌", "다크 모드에서 채도 과잉"],
    color: "#ff2e88",
    sources: [
      { label: "W3C · Contrast minimum", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html", note: "텍스트 명도 대비 기준" },
      { label: "Material · Color system", url: "https://m3.material.io/styles/color/overview", note: "역할 기반 컬러 설계" },
      { label: "MDN · color()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color", note: "현대 CSS 색상 표현" },
    ],
  },
  {
    id: "3d-graphics-animation",
    no: "04",
    title: "3D 그래픽 및 애니메이션",
    english: "3D & ANIMATION",
    summary: "제품 이해, 공간감, 브랜드 세계관을 3차원 장면과 물성 있는 움직임으로 전달한다.",
    signal: "3D는 장식보다 관찰·조작·설명의 이점이 있을 때 가장 강하다.",
    patterns: ["제품 360° 보기", "깊이 기반 카드", "스크롤 카메라", "물성 있는 조명·그림자"],
    checklist: ["초기 화면은 정적 포스터로 즉시 표시", "저사양 기기와 데이터 절약 모드 폴백", "드래그 조작에 명확한 힌트·키보드 대안"],
    risks: ["큰 모델·텍스처 용량", "GPU 발열과 프레임 저하", "텍스트 가독성 희생"],
    color: "#00a6ff",
    sources: [
      { label: "Three.js", url: "https://threejs.org/docs/", note: "WebGL 기반 3D 렌더링" },
      { label: "model-viewer", url: "https://modelviewer.dev/", note: "웹의 3D·AR 제품 뷰어" },
      { label: "web.dev · WebGL best practices", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices", note: "성능과 안정성 체크" },
    ],
  },
  {
    id: "biometric-auth",
    no: "05",
    title: "생체 인증",
    english: "BIOMETRIC AUTH",
    summary: "지문·얼굴을 서버에 보내는 대신 기기 인증으로 패스키의 개인키 사용을 승인한다.",
    signal: "UI 문구는 ‘생체정보 전송’이 아니라 ‘이 기기에서 본인 확인’이라는 실제 모델을 설명해야 한다.",
    patterns: ["패스키 우선 로그인", "플랫폼 인증기 선택", "인증 실패 후 대체 수단", "민감 작업 재인증"],
    checklist: ["WebAuthn·플랫폼 API 사용", "취소·실패·기기 변경 복구 경로 제공", "계정 복구를 생체 인증 하나에만 의존하지 않기"],
    risks: ["생체정보 저장 방식에 대한 오해", "기기 분실·교체", "강요된 인증과 접근성 문제"],
    color: "#00b894",
    sources: [
      { label: "W3C · WebAuthn Level 3", url: "https://www.w3.org/TR/webauthn-3/", note: "웹 공개키 인증 표준" },
      { label: "Passkeys.dev", url: "https://passkeys.dev/", note: "패스키 구현·UX 가이드" },
      { label: "Apple · Passkeys", url: "https://developer.apple.com/passkeys/", note: "플랫폼 패스키 경험" },
    ],
  },
  {
    id: "ar-vr",
    no: "06",
    title: "AR/VR 경험",
    english: "AR / VR",
    summary: "현실 위 정보 오버레이 또는 몰입 공간을 통해 크기·맥락·공간 관계를 체험하게 한다.",
    signal: "사용자가 왜 공간 경험으로 들어가야 하는지, 시작 전에 분명한 효용을 보여준다.",
    patterns: ["내 공간에 배치", "공간 안내 오버레이", "360° 투어", "손·시선 기반 직접 조작"],
    checklist: ["권한 요청 전에 기능과 데이터 사용 설명", "앉은 자세·좁은 공간도 지원", "2D 대체 경험 제공"],
    risks: ["멀미·피로", "카메라·공간 데이터 프라이버시", "기기 파편화"],
    color: "#8b5cf6",
    sources: [
      { label: "W3C · WebXR Device API", url: "https://www.w3.org/TR/webxr/", note: "웹 XR 표준" },
      { label: "Immersive Web samples", url: "https://immersive-web.github.io/webxr-samples/", note: "브라우저 실행 예제" },
      { label: "Apple · Spatial design", url: "https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos", note: "공간 UI 설계 원칙" },
    ],
  },
  {
    id: "personalization",
    no: "07",
    title: "개인화된 사용자 경험",
    english: "PERSONALIZATION",
    summary: "행동·선호·상황 데이터를 기반으로 콘텐츠 순서, 추천, 밀도, 알림을 맞춘다.",
    signal: "개인화가 무엇을 바꿨고 왜 이 결과가 보이는지 사용자가 이해·수정할 수 있어야 한다.",
    patterns: ["이유가 보이는 추천", "명시적 관심사 설정", "상황별 홈 구성", "개인화 끄기·초기화"],
    checklist: ["필요한 데이터만 수집", "추천 이유와 제어권 노출", "콜드 스타트용 비개인화 기본값"],
    risks: ["필터 버블", "민감 속성 추론", "과도한 친밀감이 주는 불쾌함"],
    color: "#f7b731",
    sources: [
      { label: "W3C · Privacy principles", url: "https://www.w3.org/TR/privacy-principles/", note: "데이터 최소화와 사용자 제어" },
      { label: "Nielsen Norman Group · Personalization", url: "https://www.nngroup.com/articles/personalization-versus-customization/", note: "개인화와 사용자 설정의 차이" },
      { label: "ICO · Data protection by design", url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-by-design-and-default/", note: "프라이버시 기본 설계" },
    ],
  },
  {
    id: "sustainable-design",
    no: "08",
    title: "지속 가능한 디자인",
    english: "SUSTAINABLE DESIGN",
    summary: "전송량·연산·기기 수명과 사용자의 시간까지 줄이는 작고 오래가는 디지털 경험을 설계한다.",
    signal: "친환경 이미지를 더하는 일이 아니라 불필요한 페이지·데이터·렌더링을 제거하는 일.",
    patterns: ["경량 기본 경험", "사용자 요청 후 미디어 로드", "오래 쓰는 컴포넌트", "탄소·전력 측정"],
    checklist: ["이미지·폰트·스크립트 예산 설정", "캐시와 정적 생성을 우선", "저전력·저대역폭 환경에서 핵심 작업 검증"],
    risks: ["근거 없는 그린 클레임", "측정 도구 수치의 과신", "다크 모드=친환경이라는 단순화"],
    color: "#20bf6b",
    sources: [
      { label: "W3C · Web Sustainability Guidelines", url: "https://www.w3.org/TR/web-sustainability-guidelines/", note: "지속 가능한 웹 권고안" },
      { label: "The Green Web Foundation", url: "https://www.thegreenwebfoundation.org/", note: "친환경 호스팅·측정 자료" },
      { label: "Sustainable Web Design", url: "https://sustainablewebdesign.org/", note: "실무 원칙과 패턴" },
    ],
  },
  {
    id: "dark-mode",
    no: "09",
    title: "다크 모드",
    english: "DARK MODE",
    summary: "어두운 환경에서 눈부심을 줄이고, 사용자·시스템 선호에 맞는 대체 색 체계를 제공한다.",
    signal: "검정을 뒤집는 작업이 아니라 표면·고도·대비·브랜드색을 다시 설계하는 일.",
    patterns: ["시스템 설정 자동 추종", "3단계 테마 선택", "표면별 명도 레이어", "미디어 밝기 보정"],
    checklist: ["prefers-color-scheme 지원", "선택값을 기기에 저장", "순수 검정 위 순백 장문을 피하고 대비 재검사"],
    risks: ["그림자·고도 표현 소실", "채도 높은 색의 번짐", "테마 전환 순간 깜빡임"],
    color: "#596275",
    sources: [
      { label: "MDN · prefers-color-scheme", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme", note: "시스템 테마 감지" },
      { label: "Material · Dark theme", url: "https://m2.material.io/design/color/dark-theme.html", note: "어두운 표면과 고도" },
      { label: "web.dev · color-scheme", url: "https://web.dev/articles/color-scheme", note: "브라우저 UI까지 테마 적용" },
    ],
  },
  {
    id: "kinetic-typography",
    no: "10",
    title: "키네틱 타이포그래피",
    english: "KINETIC TYPE",
    summary: "글자의 위치·크기·무게·속도를 움직여 말의 리듬과 의미를 시간 기반으로 전달한다.",
    signal: "텍스트를 읽기 어렵게 만드는 효과가 아니라 읽는 순서와 억양을 보조해야 한다.",
    patterns: ["단어 단위 리빌", "가변 폰트 축 애니메이션", "스크롤 타이틀", "상태를 말하는 숫자 전환"],
    checklist: ["DOM의 실제 텍스트를 유지", "중요 문장은 모션 없이 즉시 접근 가능", "reduced-motion에서 정적 레이아웃 제공"],
    risks: ["가독성·번역 길이 문제", "스크린리더 중복 읽기", "레이아웃·페인트 비용"],
    color: "#eb3b5a",
    sources: [
      { label: "MDN · Web Animations API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API", note: "브라우저 애니메이션 제어" },
      { label: "MDN · Variable fonts", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide", note: "가변 폰트 축 활용" },
      { label: "W3C · Pause, stop, hide", url: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html", note: "움직이는 콘텐츠 제어" },
    ],
  },
  {
    id: "gamification",
    no: "11",
    title: "게이미피케이션",
    english: "GAMIFICATION",
    summary: "목표·진행·피드백·선택 구조를 게임 밖의 경험에 적용해 참여와 학습을 돕는다.",
    signal: "포인트를 붙이는 것보다 사용자가 의미 있는 진전을 느끼는 피드백 루프가 먼저다.",
    patterns: ["명확한 다음 목표", "숙련도·진행 지도", "선택 가능한 도전", "사회적 협력"],
    checklist: ["제품의 본래 가치와 보상 연결", "연속 기록 실패에 회복 장치 제공", "실험으로 단기 클릭과 장기 만족을 함께 측정"],
    risks: ["중독·압박·수치심", "외재적 보상이 내재 동기 훼손", "조작적 다크 패턴"],
    color: "#fa8231",
    sources: [
      { label: "ACM · Defining Gamification", url: "https://dl.acm.org/doi/10.1145/2181037.2181040", note: "학술적 정의의 출발점" },
      { label: "OECD · Dark commercial patterns", url: "https://www.oecd.org/en/publications/dark-commercial-patterns_44f5e846-en.html", note: "조작적 설계 경계" },
      { label: "Duolingo Design", url: "https://blog.duolingo.com/tag/design/", note: "학습 제품의 피드백 사례" },
    ],
  },
  {
    id: "microinteractions",
    no: "12",
    title: "마이크로인터랙션",
    english: "MICROINTERACTIONS",
    summary: "하나의 트리거에 하나의 목적을 가진 작은 피드백으로 상태·결과·다음 행동을 설명한다.",
    signal: "Trigger → Rules → Feedback → Loops & Modes. ‘예쁜 모션’보다 한 행동의 완결성이 핵심.",
    patterns: ["버튼 눌림·로딩", "입력 검증", "좋아요·저장", "토스트·실행 취소", "스위치·드래그", "빈 상태의 다음 행동"],
    checklist: ["입력 후 100ms 안에 반응 신호", "모션·소리·햅틱은 같은 상태를 일관되게 표현", "reduced-motion·키보드·터치·오류 상태 포함"],
    risks: ["느린 장식이 작업을 막음", "성공 모션이 실제 성공보다 먼저 나옴", "hover에만 숨은 기능"],
    color: "#00b8d4",
    sources: [
      { label: "Toss Tech · 인터랙션, 꼭 넣어야 해요?", url: "https://toss.tech/article/interaction", note: "토스의 역할·Rally·모션 시스템" },
      { label: "Apple HIG · Motion", url: "https://developer.apple.com/design/human-interface-guidelines/motion", note: "상태·피드백 중심의 모션 원칙" },
      { label: "Material · Motion", url: "https://m3.material.io/styles/motion/overview", note: "지속시간·이징·전환 체계" },
    ],
  },
];

export const microRepos = [
  { name: "Amicro", repo: "Subhan-code/Amicro--Micro-transitions-", url: "https://github.com/Subhan-code/Amicro--Micro-transitions-", tag: "React · Motion", note: "카드·버튼·텍스트 전환을 CLI로 복사하는 컬렉션", stars: "885+" },
  { name: "Motion Primitives", repo: "ibelick/motion-primitives", url: "https://github.com/ibelick/motion-primitives", tag: "React · Motion", note: "접근 가능한 복사형 모션 UI 프리미티브", stars: "5.7k+" },
  { name: "Magic UI", repo: "magicuidesign/magicui", url: "https://github.com/magicuidesign/magicui", tag: "React · Tailwind", note: "랜딩·제품 UI용 애니메이션 컴포넌트", stars: "21k+" },
  { name: "React Bits", repo: "DavidHDev/react-bits", url: "https://github.com/DavidHDev/react-bits", tag: "React", note: "텍스트·배경·인터랙티브 컴포넌트 모음", stars: "44k+" },
  { name: "Motion", repo: "motiondivision/motion", url: "https://github.com/motiondivision/motion", tag: "JS · React", note: "제스처·레이아웃·스크롤 애니메이션 기반 라이브러리", stars: "32k+" },
  { name: "AutoAnimate", repo: "formkit/auto-animate", url: "https://github.com/formkit/auto-animate", tag: "Framework agnostic", note: "DOM 추가·삭제·정렬을 자동 전환", stars: "13k+" },
  { name: "Sonner", repo: "emilkowalski/sonner", url: "https://github.com/emilkowalski/sonner", tag: "React", note: "정교한 상태·제스처를 가진 토스트 사례", stars: "12k+" },
  { name: "react-spring", repo: "pmndrs/react-spring", url: "https://github.com/pmndrs/react-spring", tag: "React · Spring", note: "물리 기반 인터랙션과 전환", stars: "29k+" },
  { name: "use-gesture", repo: "pmndrs/use-gesture", url: "https://github.com/pmndrs/use-gesture", tag: "React · Gestures", note: "드래그·핀치·휠 제스처를 컴포넌트에 연결", stars: "9.6k+" },
  { name: "UI Layouts", repo: "ui-layouts/uilayouts", url: "https://github.com/ui-layouts/uilayouts", tag: "React · Tailwind", note: "복사 가능한 컴포넌트·효과·블록", stars: "3.5k+" },
  { name: "Lottie React", repo: "LottieFiles/lottie-react", url: "https://github.com/LottieFiles/lottie-react", tag: "React · Lottie", note: "After Effects 기반 벡터 모션 재생", stars: "790+" },
  { name: "Motion UI Design", repo: "fliptheweb/motion-ui-design", url: "https://github.com/fliptheweb/motion-ui-design", tag: "Awesome list", note: "모션 UI 자료·도구·원칙 큐레이션", stars: "900+" },
];

export const koreanCases = [
  { company: "TOSS", title: "인터랙션, 꼭 넣어야 해요?", url: "https://toss.tech/article/interaction", takeaway: "명확한 피드백과 다음 행동 안내, easing 토큰화, 사내 Rally 라이브러리 구축." },
  { company: "TOSS", title: "첫 인터랙션 디자이너가 문제를 해결하는 법", url: "https://toss.tech/article/1st_interaction_designer", takeaway: "사례 수집에서 시작해 제품 전반의 모션 품질과 시스템을 만드는 역할." },
  { company: "TOSS BANK", title: "직접 만지고, 돌리는 토스뱅크카드", url: "https://toss.tech/article/touch-and-turn-tossbankcard", takeaway: "카드의 앞뒤 차이를 설명 문구 대신 직접 조작 가능한 3D 피드백으로 전달." },
  { company: "TOSS", title: "토스 디자인 시스템", url: "https://toss.tech/article/toss-design-system", takeaway: "접근성 규칙을 컴포넌트에 내장하고 인터랙션의 정성적 느낌까지 시스템화." },
  { company: "TOSS", title: "불필요한 클릭 없애는 4가지 방법", url: "https://toss.tech/article/4-ways-for-minimum-input", takeaway: "작은 디테일을 장식이 아닌 사용자 노력 제거의 관점에서 판단." },
  { company: "LINE", title: "LINE Design System", url: "https://designsystem.line.me/", takeaway: "컴포넌트뿐 아니라 인터랙션 방법과 화면 간 일관된 흐름을 통합 가이드로 관리." },
  { company: "WOOWA", title: "우아한공방 시각적 회귀 테스트", url: "https://techblog.woowahan.com/17081/", takeaway: "디자인 시스템의 미세한 시각 변화가 제품 전체에서 깨지지 않도록 자동 검증." },
  { company: "KAKAO", title: "실시간 메시징 성능 설계", url: "https://tech.kakao.com/posts/679", takeaway: "댓글·좋아요 같은 인터랙션 피드백 뒤의 발행량·구독자 수·데이터 구조를 함께 설계." },
];
