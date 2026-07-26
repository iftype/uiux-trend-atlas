# 02. 몰입형 스크롤링

스크롤을 단순한 문서 이동이 아니라 시간축, 카메라, 챕터 전환으로 사용하는 패턴이다. 좋은 사례는 사용자의 스크롤을 강제로 재해석하지 않고 콘텐츠 관계를 분명하게 만든다.

## 대표 패턴

- 스티키 텍스트와 교체되는 이미지
- 챕터 진행률과 앵커 탐색
- 스크롤 위치에 연결된 리빌·확대·카메라 이동
- 제품 단계 비교, 타임라인, 가로 스냅 갤러리

## 구현·UX 체크

- CSS Scroll-driven Animations와 Scroll Snap 같은 네이티브 기능을 우선 검토한다.
- 자바스크립트가 꺼지거나 모션이 비활성화되어도 모든 정보를 읽을 수 있어야 한다.
- `prefers-reduced-motion`에서는 패럴랙스와 큰 이동을 제거한다.
- 스크롤 재킹, 긴 핀 구간, 숨은 스크롤바를 피한다.

## 참고

- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
- [MDN: CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)
- [WCAG: Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
