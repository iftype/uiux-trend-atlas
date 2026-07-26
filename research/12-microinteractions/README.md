# 12. 마이크로인터랙션

마이크로인터랙션은 하나의 트리거에 하나의 목적을 가진 작은 피드백이다. 사용자의 행동을 인식하고, 시스템 상태와 결과, 다음 행동을 설명해 하나의 작은 작업을 완결한다.

## 기본 구조

1. **Trigger** — 탭, 입력, 스크롤, 시스템 이벤트
2. **Rules** — 어떤 조건에서 무엇이 일어나는가
3. **Feedback** — 시각, 소리, 햅틱으로 상태를 어떻게 알리는가
4. **Loops & Modes** — 반복될 때 무엇이 달라지고 별도 모드가 필요한가

## 실무 체크리스트

- 입력 후 100ms 안에 눌림·진행 같은 반응 신호가 보이는가?
- 로딩, 성공, 실패, 비활성, 취소 상태가 모두 설계되어 있는가?
- 모션이 실제 결과보다 먼저 성공을 선언하지 않는가?
- 키보드, 터치, 스크린리더, `prefers-reduced-motion`을 지원하는가?
- 효과가 작업을 지연하지 않으며 반복 사용에도 피곤하지 않은가?
- 공통 duration, easing, spring, 거리 토큰으로 시스템화했는가?

## 오픈소스 샘플

별표 수는 **2026-07-26 조사 시점의 대략값**이다. 도입 전 라이선스, 최근 릴리스, 이슈 상태를 다시 확인해야 한다.

| 프로젝트 | 초점 | 참고 |
|---|---|---|
| [Amicro](https://github.com/Subhan-code/Amicro--Micro-transitions-) | React + Motion 복사형 전환·카드 | MIT, CLI와 shadcn registry |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | 접근 가능한 모션 프리미티브 | MIT |
| [Magic UI](https://github.com/magicuidesign/magicui) | 랜딩·제품용 애니메이션 컴포넌트 | MIT |
| [React Bits](https://github.com/DavidHDev/react-bits) | 텍스트·배경·인터랙티브 컴포넌트 | 라이선스 재확인 권장 |
| [Motion](https://github.com/motiondivision/motion) | 제스처·레이아웃·스크롤 애니메이션 | MIT |
| [AutoAnimate](https://github.com/formkit/auto-animate) | DOM 추가·삭제·정렬 자동 전환 | MIT |
| [Sonner](https://github.com/emilkowalski/sonner) | 토스트의 상태·제스처·스택 | MIT |
| [react-spring](https://github.com/pmndrs/react-spring) | 물리 기반 전환 | MIT |
| [use-gesture](https://github.com/pmndrs/use-gesture) | 드래그·핀치·휠 제스처 | MIT |
| [UI Layouts](https://github.com/ui-layouts/uilayouts) | 복사형 컴포넌트·효과·블록 | MIT |
| [Lottie React](https://github.com/LottieFiles/lottie-react) | Lottie 벡터 모션 재생 | MIT |
| [Motion UI Design](https://github.com/fliptheweb/motion-ui-design) | 모션 UI 자료 큐레이션 | awesome list |

> 샘플 저장소의 코드를 이 레포에 복제하지 않고 원문 링크와 평가 메모를 보관한다. 코드 도입 시 각 프로젝트 라이선스를 따른다.

## 국내 기업 공개 사례

### Toss

- [인터랙션, 꼭 넣어야 해요?](https://toss.tech/article/interaction) — 피드백과 다음 행동 안내, easing 토큰화, 사내 인터랙션 라이브러리 Rally 구축.
- [첫 인터랙션 디자이너가 문제를 해결하는 법](https://toss.tech/article/1st_interaction_designer) — 사례 수집에서 제품 전반의 모션 품질과 시스템 구축으로 확장된 역할.
- [직접 만지고, 돌리는 토스뱅크카드 인터랙션](https://toss.tech/article/touch-and-turn-tossbankcard) — 설명 문구 대신 직접 조작 가능한 3D 피드백으로 카드의 앞뒤 차이를 전달.
- [토스 디자이너가 제품에만 집중할 수 있는 방법](https://toss.tech/article/toss-design-system) — 접근성 규칙과 정성적 인터랙션 품질을 컴포넌트에 내장.
- [2초 만에 불필요한 클릭 없애는 4가지 방법](https://toss.tech/article/4-ways-for-minimum-input) — 작은 디테일을 장식이 아니라 사용자 노력 제거로 판단.
- [시니어 사용자가 어려워하는 UX 5가지](https://toss.tech/article/senior-usability-research) — 눈에 띄는 모션이 오히려 작은 설명을 가릴 수 있다는 리서치 사례.

### LINE

- [LINE Design System](https://designsystem.line.me/) — 컴포넌트, 인터랙션 방법, 화면 간 흐름을 통합 가이드로 운영.
- [Design Principles](https://designsystem.line.me/about/design-principle-en) — 주요 작업의 명료성, 신뢰, 화면을 넘는 일관된 경험을 강조.

### 우아한형제들

- [우아한형제들 디자인 시스템에 시각적 회귀 테스트 적용하기](https://techblog.woowahan.com/17081/) — 미세한 시각 변화가 여러 제품에서 깨지지 않게 자동 검증. 직접적인 모션 가이드라기보다 인터랙션 품질을 지속시키는 운영 참고 사례다.

### Kakao

- [실시간 메시징 시스템 개발: 성능 테스트 설계와 분석](https://tech.kakao.com/posts/679) — 댓글·좋아요 같은 즉시 피드백 뒤에서 구독자 수, 발행량, 데이터 구조를 함께 다루는 기술 사례.

## 함께 볼 원칙

- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Material 3: Motion](https://m3.material.io/styles/motion/overview)
- [WCAG: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
