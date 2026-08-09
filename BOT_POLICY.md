# UI/UX Trend Atlas crawler policy

## Identity and purpose

- Product token: `uiux-trend-atlas`
- User-Agent: `uiux-trend-atlas/1.1 (+https://github.com/iftype/uiux-trend-atlas/blob/main/BOT_POLICY.md)`
- Purpose: 공개된 공식 RSS/Atom 피드에서 UI/UX·프론트엔드 관련 글의 최소 메타데이터를 확인해 원문 링크 인덱스를 갱신합니다.
- Operator contact: [GitHub Issues](https://github.com/iftype/uiux-trend-atlas/issues/new)

## Schedule and request behavior

- 기본 스케줄은 주 1회 월요일 00:17 UTC이며, 유지보수자가 수동으로 실행할 수 있습니다.
- 최대 네 개 출처 그룹만 병렬 처리하고 같은 출처의 피드는 순차 처리하며 요청 사이에 최소 350ms를 둡니다.
- 요청 제한 시간은 18초입니다. 429 또는 503 응답은 `Retry-After`를 확인해 최대 15초 안에서 한 번만 재시도합니다.
- 피드와 `robots.txt` 리다이렉트는 각각 최대 5회까지만 따릅니다.
- 인증, 로그인, CAPTCHA, 유료벽 또는 접근 제어를 우회하지 않습니다.
- 오픈소스 상태는 GitHub 공식 REST API에서 별표 수, 최근 push 날짜, 보관 여부와 최신 릴리스 태그만 확인하며 최대 네 저장소 그룹만 병렬 처리합니다.

## robots.txt behavior

매 실행에서 피드를 요청하기 전에 해당 origin의 `/robots.txt`를 확인하고, 피드가 리다이렉트되면 새 목적지에서도 다시 확인합니다. `uiux-trend-atlas` 그룹을 우선하고 없으면 `*` 그룹을 적용하며, 가장 구체적인 규칙과 동일 길이에서 `Allow` 우선 원칙을 사용합니다.

- 2xx: 게시된 규칙을 적용합니다.
- 404/410 및 RFC 9309상 일반적인 4xx unavailable 응답: 공개 규칙이 없는 것으로 처리합니다.
- 401/403/429, 5xx, 네트워크 오류 또는 불완전한 리다이렉트: 보수적으로 수집을 중단합니다.
- 실행 중 읽은 정책은 해당 실행에서만 캐시합니다.

robots 허용은 접근 권한이나 저작권 허락으로 간주하지 않습니다. 공식 공개 피드와 아래 최소 저장 범위를 별도로 지킵니다.

## Stored data

피드에서 영구 저장하는 필드는 글 제목, 원문 URL, 발행일, 출처, 내부 주제 태그와 수집 감사 정보뿐입니다. 피드 설명문은 관련성 분류를 위해 메모리에서 일시 처리한 뒤 폐기하며 글 본문·이미지·영상·외부 코드를 저장하지 않습니다. GitHub API에서는 위에 명시한 저장소 상태 메타데이터만 보관합니다.

현재 판정은 [`research/13-foreign-tech-blogs/LATEST.md`](./research/13-foreign-tech-blogs/LATEST.md)와 생성 JSON의 `robots` 필드에서 확인할 수 있습니다. 제외 또는 속도 조정 요청은 [Issue](https://github.com/iftype/uiux-trend-atlas/issues/new)로 접수합니다.
