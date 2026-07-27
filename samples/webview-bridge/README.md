# Versioned WebView Bridge

[`bridge-contract.ts`](./bridge-contract.ts)는 다음 실패를 막기 위한 최소 웹 측 계약이다.

- 요청과 응답을 연결할 `id`
- 호환성을 판단할 `version`
- 허용할 기능만 표현하는 `method` union
- 무한 대기를 막는 timeout
- 성공과 오류의 명시적 응답

네이티브 측에서는 반드시 다음을 추가한다.

1. 신뢰한 HTTPS origin에서만 브리지를 노출한다.
2. method allowlist와 payload 타입·크기·권한을 검증한다.
3. 민감한 payload와 token을 로그에 남기지 않는다.
4. UI 스레드에서 무거운 JSON·파일·DB 작업을 실행하지 않는다.
5. 웹과 네이티브 릴리스가 엇갈릴 때의 버전 오류를 반환한다.
