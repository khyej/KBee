# 💰 KBee – Vue.js 기반 가계부 애플리케이션

## 📅 프로젝트 기간
2025.04.07 ~ 2025.04.11

## 👥 팀 구성
총 5인 (프론트엔드, 디자인, DB, CSS, 기획 등 역할 분담)

## 🛠 사용 기술

- **Frontend**: HTML, CSS, JavaScript, Vue.js
- **Backend (Mock API)**: json-server
- **디자인/기획 협업**: Figma, Notion

---

## 🎯 프로젝트 목표

- Vue.js를 활용한 직관적인 가계부 애플리케이션 구현
- json-server를 활용한 로컬 기반 CRUD 기능 개발
- 달력 기반 수입/지출 입력 및 월별 통계 시각화
- 소비 기록 습관 형성과 예산 관리 도우미 역할 수행

---

## 📌 주요 기능

### ✅ MVP 기능
- 사용자 회원가입 및 로그인
- 날짜 기반 수입/지출 등록 및 목록 확인
- 금액, 카테고리, 결제수단, 설명, 날짜 정보 입력
- 월별 수입/지출 총계 확인
- 수정, 삭제 기능
- 반응형 레이아웃 구현

---

## 🧩 프로젝트 구조 및 설계

### 📁 주요 화면
- 대시보드
- 내역 등록/수정 화면
- 달력 기반 소비 내역 확인
- 월별 소비 통계

📎 관련 문서  
- [요구사항 정의서](https://www.notion.so/1cbbee572c07808ea157ce4e8bc52800?pvs=21)  
- [피그마 설계도](https://www.notion.so/1cebee572c0780b29392c2326c5e9bf6?pvs=21)  
- [MVP 기능 목록](https://www.notion.so/MVP-1cbbee572c0780dd8b7ff177c4bceb61?pvs=21)  

### 🗃 DB 설계
- users, incomes, expenses, categories 테이블 구성
- user_id를 기준으로 항목 구분
- json-server를 통해 RESTful API로 CRUD 처리

📎 DB 관련 자료  
- [DB 구조 문서](https://www.notion.so/DB-1cbbee572c07803992a4eece79321e8f?pvs=21)  
- [db.json 예시](https://www.notion.so/db-json-1cbbee572c0780399d2ad2d0b079f4b6?pvs=21)

---

## ✅ KBee의 의미

### 🌟 KBee = KB(국민은행) + Bee(꿀벌)

| 요소 | 설명 |
|------|------|
| 🐝 부지런함 | 하루하루 소비 기록 습관 형성 |
| 💰 저축 | 꿀벌처럼 조금씩 모아 큰 자산 형성 |
| 🏘 커뮤니티 | 벌집처럼 소비 습관 공유 |
| 🧠 현명함 | 효율적으로 소비하고 낭비는 줄이는 습관 |

📌 **슬로건**: `Keep Budget Every Entry` – 매일 예산을 관리하는 습관

---

## 👤 개인 기여

- `카테고리` 관련 json-server 데이터 설계 및 작성
- 프로젝트 구조 파악 및 요구사항 정리
- 기능 테스트 및 피드백 지원
- 문서 정리 및 일정 관리 협업

---

## 🔗 참고 자료

- [비주얼 가계부 레퍼런스](https://www.notion.so/1cebee572c0780a29b19c04b3eb62091?pvs=21)
- [Tasks Tracker](https://www.notion.so/1cabee572c0780bbb437deff24733616?pvs=21)

---

## 📸 스크린샷

> 📷 (사용한 UI 캡처 이미지를 여기에 첨부)

---

## 📢 향후 계획

- Firebase 기반 사용자 인증 추가
- 지출/수입에 따른 카테고리별 통계 시각화
- 공동 가계부 기능 (여러 사용자 협업