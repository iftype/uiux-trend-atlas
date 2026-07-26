# 05. 생체 인증

웹과 앱의 일반적인 생체 인증은 서버가 지문이나 얼굴 원본을 받는 구조가 아니다. 플랫폼 인증기가 기기 안에서 사용자를 확인하고 패스키의 개인키 사용을 승인한다.

## 대표 패턴

- 패스키 우선 로그인
- 기기의 얼굴·지문·PIN으로 플랫폼 인증
- 결제·설정 변경 전 재인증
- 기기 변경과 계정 복구

## 구현·UX 체크

- 웹에서는 WebAuthn, 모바일에서는 플랫폼의 공식 인증 API를 사용한다.
- “얼굴 정보를 전송합니다” 같은 잘못된 표현을 피하고 기기 내 확인임을 설명한다.
- 취소·실패·센서 미지원·기기 분실을 위한 대체 경로를 제공한다.
- 생체 인증 하나만으로 계정 복구를 막지 않는다.

## 참고

- [W3C: Web Authentication Level 3](https://www.w3.org/TR/webauthn-3/)
- [Passkeys.dev](https://passkeys.dev/)
- [Apple: Passkeys](https://developer.apple.com/passkeys/)
