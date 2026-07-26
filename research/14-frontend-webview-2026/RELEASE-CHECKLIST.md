# WebView Release Checklist

## 레이아웃과 입력

- [ ] 세로·가로 회전과 split view에서 콘텐츠가 잘리지 않는다.
- [ ] `100dvh`/`100svh`와 `env(safe-area-inset-*)`를 실제 의도에 맞게 사용한다.
- [ ] 키보드가 입력 필드, 오류 메시지, 제출 버튼을 가리지 않는다.
- [ ] 200% 텍스트 확대와 OS 큰 글자 설정에서도 고정 높이 때문에 내용이 사라지지 않는다.
- [ ] 노치, 홈 인디케이터, 네이티브 탭바·툴바 영역을 확인했다.

## 탐색과 링크

- [ ] Android 뒤로가기와 iOS 스와이프가 웹 히스토리·네이티브 스택과 충돌하지 않는다.
- [ ] 외부 링크, 새 창, 전화, 지도, 스토어, 파일 링크의 소유권이 정해져 있다.
- [ ] Universal Link/App Link가 설치·미설치·로그아웃 상태에서 모두 복구된다.
- [ ] OAuth는 임베디드 WebView가 아니라 시스템 인증 브라우저에서 열린다.

## 브리지와 보안

- [ ] 허용한 HTTPS origin에만 JS 브리지를 노출한다.
- [ ] 모든 메시지에 버전, 타입, 요청 ID, 성공·오류 응답 계약이 있다.
- [ ] payload 타입·크기·권한을 검증하며 토큰과 개인정보를 로그에 남기지 않는다.
- [ ] `file://`, 임의 scheme, 검증되지 않은 redirect URL을 차단한다.
- [ ] 앱 소유 도메인은 정확한 scheme·host 기준 allowlist를 통과한다.
- [ ] JavaScript와 파일 접근은 필요한 화면에만 최소 범위로 켠다.

## 인증과 데이터

- [ ] 쿠키의 SameSite·Secure·HttpOnly와 네이티브 공유 정책을 확인했다.
- [ ] 세션 만료 중 폼·결제 상태의 보존 또는 폐기 규칙이 보인다.
- [ ] 패스키는 실제 WebView 기능 지원과 앱·웹 연결 파일을 검증한다.
- [ ] 로그인 취소, 다른 계정, 복귀 실패, 네트워크 단절 경로가 있다.

## 접근성과 동작

- [ ] TalkBack·VoiceOver의 읽기 순서와 웹 진입·이탈 포커스를 확인했다.
- [ ] 고정 UI와 키보드가 포커스 표시를 완전히 가리지 않는다.
- [ ] 드래그 동작에는 버튼이나 단일 포인터 대체 방법이 있다.
- [ ] 터치 타깃은 최소 24×24 CSS px이며 오조작을 막을 간격이 있다.
- [ ] `prefers-reduced-motion`, `prefers-color-scheme`, 고대비 조건을 따른다.

## 성능과 복구

- [ ] 모바일 75퍼센타일 INP 200ms 이하를 실제 사용자 데이터로 확인한다.
- [ ] 브리지 왕복, 라우트 전환, 키보드 입력의 긴 작업을 측정한다.
- [ ] 저사양 Android, 절전 모드, 느린 네트워크에서 핵심 흐름을 확인한다.
- [ ] 로딩·오프라인·HTTP 오류·SSL 오류·렌더러 종료 상태가 구분된다.
- [ ] 재시도와 외부 브라우저 열기, 고객지원용 오류 식별자가 있다.

## 최소 테스트 매트릭스

| 대상 | 최소 조합 | 집중 확인 |
|---|---|---|
| Android System WebView | 서비스 최소 API + 최신 Stable | 뒤로가기, 권한, 렌더러 종료, 다크 모드 |
| iOS WKWebView | 서비스 최소 iOS + iOS 26 | safe area, 키보드, 쿠키, 다운로드 |
| 시스템 인증 브라우저 | Custom Tabs + ASWebAuthenticationSession | OAuth, PKCE, 앱 복귀 |
| React Native WebView | 현재 채택 버전 + 최신 | postMessage, injected JS, custom header |
| 주요 인앱 브라우저 | 카카오톡·네이버·Instagram 등 | 로그인, 결제, 새 창, 딥링크 |
| 접근성·저사양 | TalkBack·VoiceOver·느린 Android | 포커스, 확대, 타깃, INP |
