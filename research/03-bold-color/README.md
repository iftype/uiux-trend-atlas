# 03. 대담한 색상 사용

고채도, 보색 대비, 넓은 컬러 블록은 브랜드 기억과 강한 정보 위계를 만든다. 중요한 것은 색의 세기가 아니라 어떤 역할에 얼마나 일관되게 쓰이는가다.

## 대표 패턴

- 중립 배경에 하나의 강한 액센트
- 섹션을 구분하는 컬러 블로킹
- 상태·위험·성공을 위한 시맨틱 컬러
- 넓은 브랜드 면과 고대비 타이포그래피

## 구현·UX 체크

- 일반 텍스트 4.5:1, 큰 텍스트 3:1 등 WCAG 대비를 검사한다.
- 오류·선택 상태를 색만으로 전달하지 않고 아이콘·문구·형태를 함께 쓴다.
- 다크 모드에서는 같은 색상값을 재사용하지 말고 채도·명도를 다시 조정한다.
- Display P3 색을 쓸 때 sRGB 폴백을 둔다.

## 참고

- [WCAG: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Material 3: Color](https://m3.material.io/styles/color/overview)
- [MDN: CSS color values](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
