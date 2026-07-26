# 07. 개인화된 사용자 경험

개인화는 사용자의 행동, 명시적 선호, 현재 상황을 이용해 콘텐츠의 순서와 밀도, 추천, 알림을 조절한다. 자동 추론만이 아니라 사용자가 직접 설정하는 커스터마이징과 함께 설계해야 한다.

## 대표 패턴

- “이 항목을 추천한 이유”가 보이는 추천
- 관심사·목표를 직접 고르는 온보딩
- 시간·장소·진행 상황에 맞는 홈
- 개인화 끄기, 기록 삭제, 추천 초기화

## 구현·UX 체크

- 목적에 필요한 최소 데이터만 수집하고 보존 기간을 정한다.
- 추천 이유와 영향을 준 신호를 이해 가능한 수준으로 노출한다.
- 사용자가 결과를 수정·숨김·초기화할 수 있게 한다.
- 데이터가 없는 신규 사용자에게 품질 좋은 비개인화 기본값을 준다.

## 참고

- [W3C: Privacy Principles](https://www.w3.org/TR/privacy-principles/)
- [NN/g: Personalization vs. Customization](https://www.nngroup.com/articles/personalization-versus-customization/)
- [ICO: Data protection by design and default](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-by-design-and-default/)
