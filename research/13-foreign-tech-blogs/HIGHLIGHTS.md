# Curated Foreign UI/UX Case Notes

자동 피드와 별개로 반복해서 참고할 가치가 높은 실제 제품 팀의 글을 문제–해법–가져갈 점으로 정리했다. 원문이 업데이트될 수 있으므로 최종 판단은 링크된 공식 글을 기준으로 한다.

## 1. Google — UX 엔지니어는 번역자이자 프로토타이퍼

**문제:** 정적인 디자인 문서만으로는 상호작용의 뉘앙스와 기술 위험을 충분히 검증하기 어렵다.

**해법:** UX 엔지니어가 디자인과 엔지니어링 사이에서 실제 데이터가 들어간 프로토타입을 만들고, 사용자 연구와 구현 가능성 검증을 제품 개발 초기에 수행한다.

**가져갈 점:** 프로토타입을 “승인을 위한 데모”가 아니라 위험한 가정을 빨리 발견하는 학습 도구로 운영한다.

- [Why Google Needs UX Engineers](https://design.google/library/why-google-needs-ux-engineers)

## 2. Figma — 캔버스 제품의 접근성을 다시 구축하기

**문제:** HTML이 아닌 캔버스로 그리는 디자인 도구는 브라우저가 기본으로 제공하는 시맨틱 구조와 스크린리더 접근성을 잃는다.

**해법:** 화면의 객체를 보조기술이 이해할 수 있는 접근 가능한 표현으로 변환하고, 키보드 조작·고대비·스크린리더 지원을 제품 개발 과정과 내부 도구에 포함한다.

**가져갈 점:** 커스텀 렌더러나 3D 캔버스를 선택하면 접근성도 별도의 제품 아키텍처로 예산화해야 한다.

- [Building accessibility into a canvas-based product](https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/)
- [Who says design needs a mouse?](https://www.figma.com/blog/introducing-keyboard-accessibility-features/)

## 3. Slack — 제품 품질은 디자인 팀만의 책임이 아니다

**문제:** AI로 산출 속도가 빨라져도 성능, 상태 처리, 애니메이션 매끄러움, 기능 간 일관성은 자동으로 좋아지지 않는다.

**해법:** 엔지니어는 최종 구현, PM은 범위와 효용, 디자이너는 전체 경험의 일관성, 리더는 품질을 낼 수 있는 조건을 소유한다.

**가져갈 점:** “디자인 검수”라는 마지막 관문 대신 역할별 품질 책임을 기획 단계부터 명시한다.

- [Product Quality: A Shared Commitment to Craft in the wake of AI](https://slack.design/articles/product-quality-a-shared-commitment-to-craft-in-the-wake-of-ai/)
- [Prototyping the path to Design Engineering](https://slack.design/articles/prototyping-the-path-to-design-engineering/)

## 4. Microsoft — 햅틱을 일관된 인터랙션 언어로 만들기

**문제:** 모든 탭과 이동에 진동을 추가하면 정보가 아니라 잡음이 된다.

**해법:** 정렬, 경계, 단계, 성공, 오류처럼 의미가 분명한 순간에 파형을 배정하고 시각·음향 피드백과 시간을 맞춘다. 원인과 결과의 연결을 위해 50ms 미만 반응을 목표로 하며, 사용자가 강도를 낮추거나 끌 수 있게 한다.

**가져갈 점:** 햅틱도 duration·intensity·waveform 토큰을 가진 디자인 시스템으로 관리한다.

- [Haptics design and implementation](https://microsoft.design/articles/haptics-design-and-implementation/)
- [A touch of feeling: advanced haptics in Windows 11](https://microsoft.design/articles/a-touch-of-feeling-advanced-haptics-in-windows-11/)

## 5. Airbnb — 개별 이벤트가 아니라 사용자 여정을 개인화하기

**문제:** 과거 예약 수나 평균 가격 같은 집계 특성이 늘어날수록 관리가 복잡해지고, 여러 세션에 걸친 탐색 맥락을 충분히 표현하기 어렵다.

**해법:** 조회, 예약, 리뷰, 취소로 이어지는 장기 게스트 여정을 시퀀스로 모델링해 검색 결과의 개인화를 강화한다.

**가져갈 점:** 추천 UI는 순간 클릭만 최적화하지 말고 여정의 단계와 장기 선호를 함께 보되, 데이터 최소화와 추천 제어권을 별도로 설계한다.

- [Personalizing Airbnb search by learning from the guest journey](https://medium.com/airbnb-engineering/personalizing-airbnb-search-by-learning-from-the-guest-journey-bcefd1915624)

## 6. Netflix — 홈페이지 전체를 하나의 생성·평가 문제로 보기

**문제:** 개인화된 홈은 여러 행과 카드의 개별 순위만으로 전체 경험의 구성과 다양성을 다루기 어렵다.

**탐구 방향:** Netflix의 GenPage 연구는 홈페이지 구성을 end-to-end 생성 문제로 다루는 방향을 공개한다.

**가져갈 점:** 생성형 개인화를 도입할 때는 카드 단위 정확도뿐 아니라 페이지 전체의 중복, 다양성, 설명 가능성, 안정성을 함께 평가해야 한다.

- [GenPage: Towards End-to-End Generative Homepage Construction at Netflix](https://netflixtechblog.com/genpage-towards-end-to-end-generative-homepage-construction-at-netflix-77146fba8a08)

## 7. GitHub — 접근 가능한 컴포넌트도 잘못 조합하면 접근할 수 없다

**문제:** 접근 가능한 버튼과 아코디언을 써도 페이지의 제목 위계, 포커스 순서, 오류 문구, 이미지 설명은 사용 맥락에 따라 깨질 수 있다.

**해법:** Primer 컴포넌트에 시맨틱·상태·보조기술 동작을 설명하는 접근성 프리셋 주석을 연결해 디자인에서 개발로 넘어갈 때 사라지는 맥락을 줄인다.

**가져갈 점:** 디자인 시스템의 접근성을 “컴포넌트 통과 여부”가 아니라 조합·콘텐츠·실사용자 테스트까지 포함한 과정으로 본다.

- [Design system annotations, part 1](https://github.blog/engineering/user-experience/design-system-annotations-part-1-how-accessibility-gets-left-out-of-components/)
- [Design’s journey towards accessibility](https://github.blog/engineering/user-experience/designs-journey-towards-accessibility/)

## 8. Duolingo — 스트릭 모션은 축하와 의미를 연결한다

**문제:** 연속 기록 숫자는 강한 동기가 되지만, 반복 화면이 무감각해지거나 실패 압박을 만들 수 있다.

**해법:** 특정 이정표를 별도의 애니메이션과 공유 카드로 표현해 노력의 의미와 축하를 강화한다.

**가져갈 점:** 게이미피케이션 모션은 매 행동을 과장하지 말고 의미 있는 이정표에 집중하며, 기록이 끊긴 사용자를 위한 회복 경험도 같이 설계한다.

- [Animating the Duolingo Streak](https://blog.duolingo.com/streak-milestone-design-animation/)

## 9. Uber — 모션과 접근성까지 시스템의 범위로 보기

**문제:** 그리드와 컴포넌트만 통일해도 언어, 모션, 접근성이 팀마다 달라지면 제품 경험은 분절된다.

**해법:** Base 디자인 플랫폼의 범위를 그리드·타이포그래피·언어·모션·접근성까지 확장한다.

**가져갈 점:** 모션 토큰과 콘텐츠 원칙을 시각 스타일의 부록이 아니라 디자인 시스템의 핵심 계층으로 관리한다.

- [Uber’s Design Platform](https://medium.com/uber-design/uber-design-platform-1ebff86c89e7)

## 10. GitHub — 토큰이 접근성 변경의 배포 단위가 된다

**문제:** 밝은·어두운 테마의 대비 문제를 화면별로 고치면 수천 개 사용처에서 누락과 불일치가 생긴다.

**해법:** Primer의 컬러 프리미티브와 디자인 토큰을 갱신해 테마 변화와 대비 개선을 제품 전반에 전파한다.

**가져갈 점:** 다크 모드와 고대비 모드는 별도 색상표가 아니라 의미 기반 토큰을 공유하는 모드로 설계한다.

- [Unlocking inclusive design: Primer’s color system](https://github.blog/engineering/user-experience/designs-journey-towards-accessibility/)
