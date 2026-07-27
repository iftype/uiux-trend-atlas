# Open Source Stack & Sample Lab

실무자가 도구 이름만 모으지 않고 “왜 쓰는지, 언제 쓰지 말아야 하는지” 판단할 수 있도록 UI primitive, 모션, 3D, WebView, 품질 자동화 도구를 분석했다.

조사 기준일: **2026-07-27**

## 선택 기준

1. **기본 플랫폼보다 분명한 이점**이 있는가?
2. 키보드·스크린리더·reduced motion을 포함한 **접근성 경로**가 있는가?
3. 최근 코드 또는 릴리스 활동이 있고 **유지보수 상태**를 확인할 수 있는가?
4. 라이선스가 제품의 배포 방식과 맞는가?
5. 제거하거나 지원이 끊겨도 핵심 UX가 남는 **폴백 구조**를 만들 수 있는가?
6. WebView나 저사양 모바일에서 비용을 설명할 수 있는가?

별표 수는 생태계 규모를 가늠하는 참고값일 뿐 추천 순위가 아니다.

## 빠른 선택

| 하고 싶은 일 | 먼저 볼 도구 | 선택 이유 |
|---|---|---|
| React 디자인 시스템 기반 | Base UI, Radix, React Aria | 접근 가능한 headless primitive |
| tooltip·popover 위치 | Floating UI | 위치 계산에 집중된 프레임워크 독립 코어 |
| 간단한 리스트 모션 | Auto Animate | 설정과 도입 비용이 작음 |
| 제품 UI 모션 | Motion | React 상태·layout·gesture 조합 |
| 복잡한 스토리텔링 | GSAP | timeline·SVG·scroll 제어가 강함 |
| 프레임워크 독립 모션 | Anime.js | 작은 API와 sequence·stagger |
| 3D 제품 경험 | Three.js | 가장 큰 WebGL/WebGPU 생태계 |
| React 3D | React Three Fiber | React와 Three scene graph 통합 |
| React Native WebView | React Native WebView | 사실상 표준 커뮤니티 구현 |
| 웹 기반 네이티브 앱 | Capacitor | 플러그인과 네이티브 프로젝트 접근 |
| 실제 성능 측정 | web-vitals | LCP·INP·CLS 현장 측정 |
| 접근성 자동 검사 | axe-core | 테스트·브라우저 통합 규칙 엔진 |
| 브라우저 E2E | Playwright | Chromium·Firefox·WebKit 단일 API |
| 컴포넌트 상태 문서 | Storybook + MSW | 격리 상태와 API 실패 재현 |
| 멀티플랫폼 토큰 | Style Dictionary | 웹·iOS·Android format 변환 |

## 라이선스 주의

- 대부분은 MIT 또는 Apache-2.0이다.
- axe-core는 MPL-2.0이므로 수정·배포 방식에 따른 의무를 확인한다.
- GSAP은 2026년 기준 전체 도구가 무료 상업 이용 가능하다고 안내하지만, 저장소는 OSI 라이선스가 아닌 [GreenSock 표준 no-charge 라이선스](https://gsap.com/standard-license)를 사용한다. “무료”와 “오픈소스”를 같은 뜻으로 취급하지 않는다.
- Ariakit 패키지는 MIT지만 사이트 코드 등 저장소 일부는 별도 proprietary license가 있어 이번 추천 목록에서는 혼합 라이선스 설명 없이 통째로 분류하지 않았다.

## 도입하지 않는 편이 나은 경우

- `dialog`, `popover`, CSS transition 몇 줄로 충분한데 런타임 라이브러리를 추가하는 경우
- scroll hijacking이 콘텐츠 이해보다 시각 연출을 우선하는 경우
- 3D의 모바일 메모리·배터리·접근성 폴백을 준비하지 못한 경우
- headless UI를 쓰면서 semantic HTML과 포커스 테스트를 생략하는 경우
- Storybook과 mock이 실제 API·제품 테스트에서 분리되어 전시용으로만 남는 경우
- Playwright의 WebKit 테스트를 실제 WKWebView 테스트와 동일하다고 보는 경우

## 실습 순서

1. [`samples/accessible-dialog`](../../samples/accessible-dialog/)로 semantic HTML과 focus 동작을 익힌다.
2. [`samples/microinteraction-save`](../../samples/microinteraction-save/)로 비동기 상태와 `aria-live`를 연결한다.
3. [`samples/safe-area-layout`](../../samples/safe-area-layout/)로 키보드·safe area·실제 viewport를 확인한다.
4. [`samples/view-transition`](../../samples/view-transition/)으로 기능 감지와 no-motion 폴백을 만든다.
5. [`samples/webview-bridge`](../../samples/webview-bridge/)로 타입·버전·timeout이 있는 브리지 계약을 작성한다.
6. 이후에만 목적에 맞는 오픈소스를 한 개씩 도입하고 접근성·성능 회귀를 측정한다.

전체 분석 데이터와 자동 갱신 상태는 [`data/open-source-stack.json`](../../data/open-source-stack.json)에 있다.
