# Frontend × WebView 2026

브라우저 한 종류에서 보기 좋은 화면과, 앱 안에서 안정적으로 동작하는 화면은 다른 문제다. WebView에서는 웹 런타임 버전, 네이티브 화면 스택, 안전 영역, 키보드, 쿠키, 권한, 인증, JS 브리지까지 하나의 사용자 경험으로 설계해야 한다.

조사 기준일: **2026-07-26**

## 2026에 달라진 기준

### 1. 기능 채택은 Baseline + 실제 WebView 버전

- [Baseline 2026](https://web.dev/baseline/2026)은 2026년에 주요 브라우저에 새로 공통 구현된 기능을 추적한다.
- `Newly available`은 최신 브라우저 간 상호운용이 시작됐다는 의미이지, 서비스의 모든 구형 WebView에서 바로 안전하다는 뜻은 아니다.
- Android는 OS API 레벨만 보지 말고 [Jetpack WebKit과 `WebViewFeature`](https://developer.android.com/develop/ui/views/layout/webapps/webview)로 런타임 기능을 감지한다.
- 새 기능은 `@supports`, API 존재 검사, 의미가 유지되는 HTML 폴백을 함께 둔다.

### 2. Apple 플랫폼에는 새 SwiftUI WebView가 등장

[Safari 26.0의 WebKit](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)은 SwiftUI용 `WebView`와 `WebPage`를 추가했다. `obscuredContentInsets`는 네이티브 탭바나 툴바가 덮는 영역을 웹 레이아웃에 반영한다. 기존 `WKWebView`를 즉시 대체하기보다 OS 가용성 검사와 기존 경로 비교 테스트가 필요하다.

### 3. 패스키도 WebView 통합 항목

- Android의 [Credential Manager WebView 연동](https://developer.android.com/identity/sign-in/credential-manager-webview)은 Jetpack WebKit 1.12.0 이상에서 네이티브 지원되며, 실제로는 `WEB_AUTHENTICATION` 기능 감지와 Digital Asset Links가 필요하다.
- Apple은 [WKWebView의 WebAuthentication challenge](https://developer.apple.com/documentation/authenticationservices/passkey-use-in-web-browsers)를 WebKit이 처리한다고 안내한다.
- Google OAuth는 [개발자가 제어하는 임베디드 user-agent를 허용하지 않는다](https://developers.google.com/identity/protocols/oauth2/policies). OAuth는 시스템 브라우저나 플랫폼 인증 세션으로 전환한다.

### 4. 새 모션 API는 progressive enhancement

- View Transitions는 SPA와 MPA의 화면 전환 코드를 줄이지만 지원되지 않는 WebView에서도 탐색이 완성되어야 한다.
- Safari 26은 Scroll-driven Animations와 Anchor Positioning을 추가했지만 후속 26.x에서도 관련 수정이 계속되고 있다.
- `prefers-reduced-motion` 폴백, `transform`·`opacity` 중심 애니메이션, 기능 감지가 기본 조건이다.

## 반드시 분리해서 설계할 네 가지 계약

| 계약 | 웹이 책임질 것 | 네이티브가 책임질 것 |
|---|---|---|
| 탐색 | URL·히스토리·페이지 상태 | 화면 스택·외부 앱·딥링크 |
| 브리지 | 버전·메시지·요청 ID·오류 스키마 | origin·권한 검증·네이티브 실행 |
| 세션 | 인증 만료·재시도·민감 데이터 정리 | 쿠키 공유 정책·보안 저장소·인증 세션 |
| 표시 영역 | `dvh`·safe area·키보드 대응 | 인셋·회전·탭바/툴바 가림 영역 |

## 핵심 구현 원칙

1. **기능 감지 우선** — UA sniffing으로 브라우저나 WebView 능력을 추정하지 않는다.
2. **origin 최소 권한** — JS 브리지와 내부 URL은 정확한 scheme·host allowlist를 통과해야 한다.
3. **복구 상태 설계** — 로딩, 오프라인, HTTP 오류, 인증 만료, 렌더러 종료를 하나의 흰 화면으로 처리하지 않는다.
4. **실기기 RUM** — Lighthouse만 보지 않고 WebView 안의 INP, 브리지 왕복, 라우트 전환을 수집한다.
5. **접근성 연속성** — 네이티브에서 웹으로 이동해도 포커스, 텍스트 확대, 스크린리더, 모션 설정이 끊기지 않아야 한다.

## 공식 자료

- [Android Developers · Build web apps in WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
- [Android Developers · Native API access with JSBridge](https://developer.android.com/develop/ui/views/layout/webapps/native-api-access-jsbridge)
- [Android Developers · Unsafe file inclusion](https://developer.android.com/privacy-and-security/risks/webview-unsafe-file-inclusion)
- [Android Developers · Unsafe URI loading](https://developer.android.com/privacy-and-security/risks/unsafe-uri-loading)
- [Apple Developer · WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)
- [Apple Developer · App-bound domains](https://developer.apple.com/documentation/webkit/wkwebviewconfiguration/limitsnavigationstoappbounddomains)
- [WebKit · Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- [web.dev · Baseline 2026](https://web.dev/baseline/2026)
- [web.dev · Interaction to Next Paint](https://web.dev/articles/inp)
- [W3C · WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [MDN · VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [Chrome Developers · View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
- [React Native WebView · Guide](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)

실제 배포 검수표는 [RELEASE-CHECKLIST.md](./RELEASE-CHECKLIST.md)에 있다.
