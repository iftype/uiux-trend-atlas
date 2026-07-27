# Copy-ready UI/UX Samples

외부 라이브러리 없이 브라우저에서 바로 열거나 프로젝트에 옮겨 쓸 수 있는 최소 예제다. 완성 컴포넌트가 아니라 접근성·폴백·오류 상태를 포함한 출발점으로 사용한다.

| 샘플 | 배우는 것 | 실행 |
|---|---|---|
| [accessible-dialog](./accessible-dialog/) | native dialog, focus, escape, reduced motion | `index.html` 열기 |
| [microinteraction-save](./microinteraction-save/) | loading·success·error 상태와 aria-live | `index.html` 열기 |
| [safe-area-layout](./safe-area-layout/) | dvh, safe area, VisualViewport, keyboard | `index.html` 열기 |
| [view-transition](./view-transition/) | API 기능 감지와 no-motion 폴백 | `index.html` 열기 |
| [webview-bridge](./webview-bridge/) | 타입 안전 메시지, origin, timeout | TypeScript 복사 |

## 적용 원칙

1. 샘플의 HTML 의미와 상태 모델을 유지한 뒤 시각 스타일을 바꾼다.
2. 지원하지 않는 브라우저에서도 핵심 작업이 끝나는지 확인한다.
3. 실제 제품에서는 오류 로깅, 국제화, 분석 이벤트와 테스트를 추가한다.
4. WebView 샘플은 네이티브 측 allowlist와 payload 검증이 함께 있어야 완성된다.
