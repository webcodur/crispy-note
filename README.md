# Crispy Note

> 자유롭게 작성하고, 편하게 구겨서 버리는 디지털 메모장

## 📝 프로젝트 소개

**Crispy Note**는 부담 없이 생각을 정리하고 싶은 모든 사람을 위한 가볍고 직관적인 메모 서비스입니다.

### 핵심 가치

- **자유로움**: 형식에 얽매이지 않는 자유로운 작성
- **가벼움**: 복잡한 기능 없이 빠르고 간단하게
- **편안함**: 삭제해도 괜찮은, 부담 없는 메모

### 주요 기능

- 🎯 "구겨서 버리기" 독특한 삭제 UX
- 📁 폴더 및 태그로 메모 조직화
- ⭐ 즐겨찾기 및 빠른 검색
- 🌙 다크모드 지원
- 📱 반응형 디자인 (PC, 모바일, 태블릿)
- ✨ 실시간 자동저장

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Authentication**: NextAuth.js

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cache**: Redis
- **Authentication**: JWT + OAuth 2.0

## 📂 프로젝트 구조

```
crispy-memo/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/      # App Router 페이지
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   └── package.json
├── backend/           # NestJS 백엔드
│   ├── src/
│   │   ├── modules/
│   │   ├── entities/
│   │   └── common/
│   └── package.json
└── package.json       # Root package.json
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- PostgreSQL 14.x 이상
- Redis 7.x 이상

### 설치 및 실행

1. **의존성 설치**

```bash
# 루트에서 모든 패키지 설치
npm install

# Frontend만
cd frontend && npm install

# Backend만
cd backend && npm install
```

2. **환경 변수 설정**

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

3. **데이터베이스 설정**

```bash
cd backend
npm run migration:run
```

4. **개발 서버 실행**

```bash
# Frontend (http://localhost:3000)
cd frontend && npm run dev

# Backend (http://localhost:4000)
cd backend && npm run start:dev
```

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary**: #F5F1E8 (크림/종이색)
- **Secondary**: #8B7355 (브라운)
- **Accent**: #FF6B6B (코랄/포인트)
- **Text**: #2C2C2C (다크 그레이)
- **Background**: #FEFEFE (오프화이트)

## 📄 라이센스

MIT License

## 👥 기여

기여를 환영합니다! PR을 보내주세요.
