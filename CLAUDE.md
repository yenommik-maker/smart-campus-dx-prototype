# Smart Campus DX — CLAUDE.md

## 프로젝트 개요
공공기관 연수원 통합 운영 플랫폼 (Smart Campus DX).
교육생 · 운영자 · 관리자 3개 역할이 실시간으로 연동되는 웹앱.
React(JSX) + Tailwind CSS + recharts 단일 파일 구조. GitHub Pages 배포.

## 디자인 시스템
- 배경: #FFFFFF 순백
- Primary: #E05C7A 로즈핑크
- Primary Dark: #C0425E 딥로즈
- Primary Light: #F4A7B3 연핑크
- 카드 배경: #FFF7F9
- 카드 테두리: #F9D0D8
- 텍스트: #1A1A1A
- 서브텍스트: #6B7280
- Success: #3E8E76
- Warning: #C8862E

## 디자인 원칙 (건강보험25시 스타일)
- 배경은 항상 순백 (bg-white)
- 카드는 shadow-sm 또는 ring-1 ring-[#F9D0D8]
- 텍스트 크고 진하게, 여백 충분히
- 버튼: rounded-xl, font-semibold
- 애니메이션 최소화, isAnimationActive={false}

## 기술 스택
- React 18, Tailwind CSS, recharts, lucide-react@0.383.0
- 단일 JSX 파일 구조
- GitHub Pages 배포

## 역할별 컴포넌트
- StudentView: 교육생 (내 객실/일정/식단/버스/QR)
- OperatorView: 운영자 (객실배정/시간표/입퇴실/시설관리/버스관리)
- AdminView: 관리자 (운영현황/통계/KPI/보고서)

## 스코프 경계
- 기존 QR 출결 시스템 복제 금지
- 내부 행정 프로그램 기능 중복 금지
- 와이파이 정보 표시 금지
- 객실 변경 신청 버튼 없음

## 버스 운영 4단계
1. arrival_survey: 입소버스 수요조사
2. arrival_confirmed: 입소버스 노선 확정, 좌석 예약 오픈
3. depart_survey: 퇴소버스 수요조사
4. all_confirmed: 퇴소버스 노선 확정, 전체 예약 오픈

## 객실 배정 규칙
- 성별 분리: 고정
- 같은 조 우선 배치: 토글
- 신청기간 내 본인선택 → locked 처리

## 환급/비환급 QR 분기
- 환급 → 파란색 고용보험 출결 QR
- 비환급 → 회색 자체 출결 QR

## 작업 규칙
- 모든 파일 수정·생성·삭제 자동 허용 (확인 없이 진행)
- npm install 자동 허용
- git add, commit, push 자동 허용
- 파일 덮어쓰기 자동 허용
