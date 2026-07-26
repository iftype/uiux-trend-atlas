# 09. 다크 모드

다크 모드는 어두운 환경에서 눈부심을 줄이고 시스템 선호에 맞춘 대체 색 체계를 제공한다. 단순 색 반전이 아니라 표면, 고도, 대비, 브랜드색을 다시 설계해야 한다.

## 대표 패턴

- 시스템 설정을 기본으로 따르는 자동 모드
- 라이트·다크·시스템 3단 선택
- 명도 차이로 표현한 표면과 고도
- 이미지·차트·일러스트의 다크 전용 보정

## 구현·UX 체크

- `prefers-color-scheme`와 `color-scheme`을 함께 검토한다.
- 사용자의 명시적 선택을 기기에 저장하되 시스템 모드로 돌아갈 수 있게 한다.
- 순수 검정 위 순백 장문의 강한 대비를 줄이고 본문 가독성을 다시 검사한다.
- 첫 페인트 전에 테마를 적용해 깜빡임을 막는다.

## 참고

- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Material: Dark theme](https://m2.material.io/design/color/dark-theme.html)
- [web.dev: color-scheme](https://web.dev/articles/color-scheme)
