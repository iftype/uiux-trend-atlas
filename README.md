# UI/UX Trend Atlas

실시간 콘텐츠부터 마이크로인터랙션까지, 12개의 인터페이스 흐름을 한국어로 정리한 오픈 리서치 레포입니다.

## 둘러보기

- [GitHub Pages 사이트](https://iftype.github.io/uiux-trend-atlas/)
- [12개 트렌드](https://iftype.github.io/uiux-trend-atlas/trends/): 각 트렌드를 독립된 읽기 페이지로 제공
- [글로벌 아티클](https://iftype.github.io/uiux-trend-atlas/global/): 공식 피드 글을 번호 페이지로 탐색
- [2026 Frontend × WebView 가이드](https://iftype.github.io/uiux-trend-atlas/field-guide/)
- [실행 샘플·스킬 맵](https://iftype.github.io/uiux-trend-atlas/samples/)
- [오픈소스 스택](https://iftype.github.io/uiux-trend-atlas/open-source/): 6개씩 비교하는 페이지 목록
- [`research/`](./research): 주제별 개념, 적용 패턴, 체크리스트, 참고 자료
- [`research/12-microinteractions/`](./research/12-microinteractions): 오픈소스 샘플과 국내 기업 공개 사례
- [`research/13-foreign-tech-blogs/`](./research/13-foreign-tech-blogs): 해외 기업 공식 블로그, 선별 사례 노트, 자동 수집 최신 글
- [`research/14-frontend-webview-2026/`](./research/14-frontend-webview-2026): 프론트엔드·WebView 구현 기준과 출시 체크리스트
- [`research/15-open-source-sample-lab/`](./research/15-open-source-sample-lab): 오픈소스 분석, 프론트엔드 스킬 맵, 복사 가능한 샘플
- [`samples/`](./samples): 의존성 없이 실행 가능한 UI·WebView 예제

## 주제

1. 실시간 콘텐츠
2. 몰입형 스크롤링
3. 대담한 색상 사용
4. 3D 그래픽 및 애니메이션
5. 생체 인증
6. AR/VR 경험
7. 개인화된 사용자 경험
8. 지속 가능한 디자인
9. 다크 모드
10. 키네틱 타이포그래피
11. 게이미피케이션
12. 마이크로인터랙션
13. 해외 기업 UI/UX 기술·디자인 블로그
14. 2026 프론트엔드·WebView 필드 가이드
15. 오픈소스 스택·샘플 랩

## 자동 업데이트 파이프라인

매주 GitHub Actions가 공식 RSS/Atom 피드와 선별한 오픈소스 저장소 메타데이터를 확인해 최신 UI/UX·웹 플랫폼·WebView 글, 릴리스와 유지보수 상태를 갱신합니다. 외부 글은 제목·원문 링크·발행일만 저장하고, 매 실행마다 피드와 리다이렉트 목적지의 `robots.txt`를 검사합니다. 변경된 데이터는 자동 커밋되고 GitHub Pages가 다시 배포됩니다. Actions의 **Refresh foreign UI UX research** 워크플로는 필요할 때 수동 실행할 수도 있습니다.

- [법적 고지·출처·데이터 정책](./LEGAL.md)
- [자동 수집기 정책](./BOT_POLICY.md)
- [코드 MIT 라이선스](./LICENSE)
- [직접 작성 콘텐츠 CC BY 4.0 및 제외 범위](./CONTENT-LICENSE.md)

## 자료 원칙

- 기업·표준기관·공식 문서를 우선합니다.
- 유행을 사실처럼 단정하지 않고, 적용 조건과 위험을 함께 기록합니다.
- 링크·별표 수·제품 상태는 변할 수 있으므로 조사일을 남깁니다.
- 접근성, 성능, 프라이버시를 시각 효과와 같은 수준으로 다룹니다.
- 외부 본문·피드 설명문·이미지는 복제하지 않고 원문으로 연결합니다.
- 권리자의 정정·제외 요청을 위한 공개 Issue 창구를 운영합니다.

조사 기준일: **2026-08-10**

## 로컬 실행

```bash
npm install
npm run dev
```

## 기여

새 사례는 해당 주제 폴더의 `README.md`에 링크, 한 줄 요약, 확인일을 추가해 주세요. 마이크로인터랙션 샘플은 라이선스와 최근 업데이트 날짜도 함께 확인하는 것을 권장합니다.
