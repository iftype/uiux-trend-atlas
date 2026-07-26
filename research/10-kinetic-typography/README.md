# 10. 키네틱 타이포그래피

글자의 위치, 크기, 무게, 간격, 속도를 시간에 따라 바꿔 말의 리듬과 의미를 전달한다. 정보 UI에서는 문장을 감추는 효과보다 읽는 순서와 억양을 보조하는 데 사용한다.

## 대표 패턴

- 문장·단어 단위 리빌
- 가변 폰트의 굵기·폭 축 변화
- 스크롤에 반응하는 대형 타이틀
- 숫자와 상태 문구의 연속 전환

## 구현·UX 체크

- 애니메이션 조각과 별개로 DOM에 완전한 실제 텍스트를 유지한다.
- 중요한 문장은 모션이 끝나기 전에도 읽을 수 있어야 한다.
- `prefers-reduced-motion`에서는 정적인 최종 상태를 즉시 보여준다.
- 한글·영문·긴 번역에서 줄바꿈과 속도를 별도로 점검한다.

## 참고

- [MDN: Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [MDN: Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- [WCAG: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
