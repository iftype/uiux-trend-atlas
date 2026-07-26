# 04. 3D 그래픽 및 애니메이션

웹 3D는 제품의 형태, 공간의 깊이, 복잡한 구조를 직접 관찰하고 조작하게 한다. 제품 360° 보기처럼 2D보다 이해가 빨라질 때 효과가 크다.

## 대표 패턴

- 제품 회전·확대·분해 보기
- 깊이 기반 카드·커버플로
- 스크롤에 연결된 카메라
- 3D 브랜드 캐릭터와 인터랙티브 장면

## 구현·UX 체크

- 첫 화면은 경량 포스터 이미지로 즉시 보여주고 모델은 지연 로드한다.
- Draco/KTX2 압축, LOD, 텍스처 크기 제한을 검토한다.
- 저사양·저전력·데이터 절약 환경에는 정적 폴백을 제공한다.
- 드래그 외 키보드 조작과 현재 시점을 설명하는 텍스트를 둔다.

## 참고

- [Three.js Documentation](https://threejs.org/docs/)
- [Google model-viewer](https://modelviewer.dev/)
- [MDN: WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
