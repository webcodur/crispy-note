# Crispy Note 설치 및 실행 가이드

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd crispy-memo

# 루트 의존성 설치
npm install

# Frontend 의존성 설치
cd frontend
npm install

# Backend 의존성 설치
cd ../backend
npm install
```

### 2. 데이터베이스 설정

PostgreSQL과 Redis를 먼저 설치하고 실행해야 합니다.

#### PostgreSQL 설치 (Windows)

```bash
# PostgreSQL 다운로드: https://www.postgresql.org/download/windows/
# 설치 후 데이터베이스 생성
psql -U postgres
CREATE DATABASE crispy_note;
```

#### Redis 설치 (Windows)

```bash
# Redis for Windows: https://github.com/microsoftarchive/redis/releases
# 또는 WSL2 사용
wsl --install
wsl
sudo apt update
sudo apt install redis-server
redis-server
```

### 3. 환경 변수 설정

#### Backend 환경 변수

```bash
cd backend
cp .env.example .env
```

`.env` 파일을 열어 다음 항목들을 설정하세요:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=crispy_note

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

#### Frontend 환경 변수

```bash
cd frontend
```

`.env.local` 파일을 생성하고 다음을 추가하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 4. 애플리케이션 실행

#### 방법 1: 루트에서 모두 실행

```bash
cd crispy-memo
npm run dev
```

#### 방법 2: 개별 실행

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. 접속

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **API 문서 (Swagger)**: http://localhost:4000/api/docs

## 📦 주요 기능

### 메모 작성

1. 대시보드에서 "새 메모" 버튼 클릭
2. 자유롭게 메모 작성
3. 자동 저장됨

### 메모 구겨서 버리기

1. 메모 카드 또는 편집 페이지에서 휴지통 아이콘 클릭
2. 구겨지는 애니메이션 확인
3. 휴지통에서 복구 가능 (30일 보관)

### 폴더 및 태그

1. 사이드바에서 폴더/태그 관리
2. 메모에 폴더/태그 할당
3. 필터링으로 메모 찾기

## 🔧 개발 명령어

### Frontend

```bash
cd frontend
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # 린트 검사
```

### Backend

```bash
cd backend
npm run start:dev    # 개발 서버 (watch mode)
npm run build        # 빌드
npm run start:prod   # 프로덕션 서버
npm run test         # 테스트
```

## 🐛 문제 해결

### PostgreSQL 연결 오류

```bash
# PostgreSQL 서비스 확인
# Windows: services.msc에서 PostgreSQL 서비스 확인
# Linux/Mac: sudo service postgresql status
```

### Redis 연결 오류

```bash
# Redis 실행 확인
redis-cli ping
# 응답: PONG
```

### 포트 충돌

- Frontend가 3000 포트를 사용 중이면 다른 포트로 변경 가능
- Backend가 4000 포트를 사용 중이면 `.env`에서 `PORT` 변경

## 📚 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [NestJS 문서](https://docs.nestjs.com)
- [TypeORM 문서](https://typeorm.io)
- [TailwindCSS 문서](https://tailwindcss.com/docs)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

MIT License
