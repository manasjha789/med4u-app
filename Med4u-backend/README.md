<h1 align="center">Med4U — Backend</h1>

<p align="center">
  Production-grade healthcare API built with NestJS, PostgreSQL, Redis, WebRTC & Socket.IO
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

## What is Med4U?

Med4U digitizes the complete patient-doctor journey for the Indian healthcare market:

**Discovery → Booking → Consultation → Prescription → Follow-up**

Three user roles: **Patient**, **Doctor**, **Admin**

---

## Architecture

```
Client (React Native)
        │
        ├── REST API (NestJS + Zod + JWT)
        ├── WebSocket (Socket.IO — real-time updates + WebRTC signaling)
        │
        ├── PostgreSQL 15   — 13 tables, atomic booking transactions
        ├── Redis 7         — OTP TTL, rate limiting, room state, token blacklist
        ├── Cloudinary      — prescription PDF/image storage + signed URLs
        ├── Twilio SMS      — OTP delivery (adapter pattern — swappable)
        └── Firebase Admin  — push notifications via FCM
```

### Clean Architecture
```
Controller → Service → Repository → Database
     ↓
  Zod Pipe (validation)
  JWT Guard (authentication)
  Roles Guard (RBAC)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 10 + TypeScript 5 (strict) |
| Database | PostgreSQL 15 + TypeORM |
| Cache / Ephemeral | Redis 7 (ioredis) |
| Real-time | Socket.IO 4 (WebSocket + long-poll fallback) |
| Auth | JWT (RS256) + Refresh Token Rotation + bcrypt |
| File Storage | Cloudinary (signed URLs, 1-hour expiry) |
| SMS | Twilio (adapter pattern) |
| Push | Firebase Admin SDK → FCM |
| Validation | Zod |
| Logging | Winston (structured JSON) |
| Docs | Swagger / OpenAPI 3.0 |
| Container | Docker + Docker Compose |

---

## Modules (9)

| Module | Responsibility |
|--------|---------------|
| `auth` | OTP login, JWT issue, refresh token rotation, logout |
| `users` | Patient profile, medical history |
| `doctors` | Registration, availability, time slots, verification |
| `appointments` | Atomic slot booking, cancellation, rescheduling |
| `consultations` | WebRTC room management, signaling via Socket.IO |
| `prescriptions` | Upload to Cloudinary, signed URL generation |
| `medicines` | 35 real medicines across 7 categories |
| `labs` | 37 lab tests, home collection booking |
| `notifications` | FCM push notifications, admin broadcasts |

---

## Database (13 Tables)

```
users            doctors          appointments      time_slots
prescriptions    otp_codes        sessions          reviews
notifications    lab_tests        lab_bookings      medicines
medical_history
```

Soft deletes on all tables. Atomic `SELECT FOR UPDATE` on slot booking.

---

## Key Features

### OTP Authentication (no passwords)
- Patient enters phone → 6-digit OTP sent via Twilio SMS
- OTP stored as **bcrypt hash** in Redis with **5-minute TTL**
- Rate limited: **3 OTPs per 10 minutes per phone number**
- On verify → issues Access Token (15 min) + Refresh Token (7 days)

### Refresh Token Rotation (theft detection)
- Every refresh invalidates the old token and issues a new pair
- Logout blacklists the refresh token in Redis
- Double-use of a refresh token → both sessions invalidated → theft detected

### Double Booking Prevention
```sql
BEGIN;
  SELECT * FROM time_slots WHERE id = $1 FOR UPDATE;
  -- row locked — concurrent bookings queue here
  UPDATE time_slots SET status = 'booked' WHERE id = $1;
  INSERT INTO appointments (...) VALUES (...);
COMMIT;
```

### WebRTC Video Consultation (P2P — zero server media cost)
```
Patient ──── webrtc:offer ────► NestJS Gateway ──── webrtc:offer ────► Doctor
Patient ◄─── webrtc:answer ──── NestJS Gateway ◄─── webrtc:answer ──── Doctor
Patient ──── ice-candidate ──►  NestJS Gateway ──── ice-candidate ──►  Doctor

After ICE → P2P established → NestJS exits media path entirely
```

### Prescription Security
1. Doctor uploads PDF → streamed to Cloudinary (private, not public)
2. `public_id` stored in PostgreSQL (never the URL)
3. Patient requests → backend verifies ownership → generates **signed URL (1-hour expiry)**
4. URL expires → re-auth required for new link

### RBAC
- JWT payload contains `role: 'patient' | 'doctor' | 'admin'`
- `RolesGuard` checks `@Roles()` decorator on every controller method
- Service layer enforces **resource ownership** (horizontal privilege check)

---

## Redis — 4 Jobs

| Job | Key Pattern | TTL |
|-----|------------|-----|
| OTP storage | `otp:{phone}` | 5 min |
| Rate limiting | `rate:otp:{phone}` | 10 min |
| Video room state | `room:{appointmentId}` | Call duration |
| Refresh token blacklist | `blacklist:{token}` | Remaining token validity |

---

## Getting Started

### Prerequisites
- Docker + Docker Compose
- Node.js 20+

### 1. Clone & configure

```bash
git clone https://github.com/abhishek-0409/Med4u-backend.git
cd Med4u-backend
cp .env.example .env
# Fill in your values in .env
```

### 2. Start with Docker

```bash
docker compose up --build
```

This starts:
- PostgreSQL 15 on port `5432`
- Redis 7 on port `6379`
- NestJS API on port `3000`

### 3. Run without Docker

```bash
npm install

# Make sure PostgreSQL and Redis are running locally, then:
npm run migration:run
npm run seed          # seeds 35 medicines + 37 lab tests + 15 doctors
npm run start:dev
```

---

## Environment Variables

```env
# App
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=med4u_user
DB_PASSWORD=med4u_password
DB_NAME=med4u_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-32-char-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=another-32-char-secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

See [`.env.example`](.env.example) for the full list.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

Auto-generated from NestJS controller decorators. Includes all endpoints, request/response schemas, and JWT auth.

---

## Scripts

```bash
npm run start:dev          # development with hot reload
npm run start:prod         # production build
npm run build              # compile TypeScript

npm run migration:generate -- --name=MigrationName
npm run migration:run      # apply pending migrations
npm run migration:revert   # rollback last migration

npm run seed               # seed medicines, lab tests, doctors
npm run seed:fresh         # revert + migrate + seed

npm run test               # unit tests
npm run test:cov           # coverage report
npm run lint               # ESLint
```

---

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/        # @CurrentUser, @Roles, @Public
│   ├── filters/           # HttpExceptionFilter
│   ├── guards/            # JwtAuthGuard, RolesGuard
│   ├── interceptors/      # ResponseInterceptor, LoggingInterceptor
│   ├── pipes/             # ZodValidationPipe
│   └── utils/             # hash, logger, pagination, response
├── config/                # database, redis, jwt, cloudinary, env validation
├── database/
│   ├── entities/          # 13 TypeORM entities
│   ├── migrations/        # versioned schema migrations
│   └── seeds/             # seed scripts
├── modules/
│   ├── auth/              # OTP, JWT, token rotation
│   ├── users/             # patient profile, medical history
│   ├── doctors/           # registration, slots, availability
│   ├── appointments/      # booking state machine
│   ├── consultations/     # WebRTC room + signaling
│   ├── prescriptions/     # Cloudinary upload + signed URLs
│   ├── medicines/         # catalog (35 medicines)
│   ├── labs/              # lab tests (37), home collection
│   └── notifications/     # FCM push notifications
├── redis/                 # Redis module + constants
└── socket/                # Socket.IO gateway + middleware
```

---

## Security

- JWT RS256 (asymmetric signing)
- Refresh token rotation with Redis blacklist
- bcrypt for OTP and refresh token hashing
- Zod validation on every request body
- Helmet security headers
- Redis-backed rate limiting
- Cloudinary signed URLs (1-hour expiry)
- Soft deletes — medical data never hard deleted
- RBAC at guard level + ownership check at service level

---

## Seeded Data

| Category | Count |
|----------|-------|
| Medicines | 35 (7 categories) |
| Lab Tests | 37 (7 categories) |
| Doctors | 15 real Indian doctors with credentials |

---

## License

Private — All rights reserved.
