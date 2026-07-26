# 01. 실시간 콘텐츠

실시간 콘텐츠는 가격, 재고, 경기, 메시지, 공동 편집 상태처럼 시간이 정보 가치에 직접 영향을 주는 데이터를 새로고침 없이 갱신하는 경험이다. 빠른 전송만큼 중요한 것은 사용자가 현재 데이터가 최신인지, 연결이 살아 있는지, 실패하면 무엇이 남는지 이해하게 하는 일이다.

## 대표 패턴

- 라이브 배지와 마지막 갱신 시각
- 목록 상단에 “새 항목 4개”처럼 제어 가능한 삽입 알림
- 낙관적 업데이트 + 실패 시 되돌리기
- 오프라인·재연결·지연 상태
- 공동 편집자의 커서, 입력 중, 충돌 상태

## 구현·UX 체크

- 서버→클라이언트 단방향이면 SSE, 양방향이면 WebSocket, 빈도가 낮으면 폴링도 비교한다.
- `aria-live`는 중요한 상태 변화에만 제한해 보조기술의 과도한 읽기를 막는다.
- 읽던 항목이 갑자기 밀리지 않도록 새 콘텐츠 삽입 시점을 사용자가 선택하게 한다.
- “실시간” 표시와 함께 마지막 수신 시각, 지연, 재시도 상태를 보여준다.

## 참고

- [MDN: WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN: Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Kakao Tech: 실시간 메시징 시스템 성능 테스트 설계와 분석](https://tech.kakao.com/posts/679)
