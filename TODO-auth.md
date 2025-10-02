# TODO List for JWT Authentication Implementation

## Authentication Utilities
- [x] Create `src/lib/auth.ts` with JWT verification middleware and token generation functions

## User Schema and Database
- [x] Define MongoDB users collection schema: _id, username (unique), password (hashed), createdAt
- [x] Update `src/lib/mongodb.ts` if needed for user queries

## API Endpoints
- [x] Create `src/app/api/auth/register/route.ts`: Handle POST for new user registration, hash password, save to MongoDB
- [x] Update `src/app/api/auth/login/route.ts`: Query MongoDB for user, verify password, generate JWT token
- [x] Add JWT middleware to `src/app/api/mobile/route.ts` (protect POST endpoint)
- [x] Add JWT middleware to `src/app/api/agent/route.ts` (protect POST endpoint)

## UI Integration
- [x] Update `src/app/page.tsx`: Add login modal/form, store token in localStorage, protect chat features
- [x] Add logout functionality
- [x] Display user info after login

## Testing
- [x] Add tests for register endpoint
- [x] Add tests for login endpoint
- [x] Add tests for protected routes (valid/invalid tokens)
- [x] Add UI tests for login flow

## Environment and Dependencies
- [x] Ensure JWT_SECRET in .env.local
- [x] Install dependencies if missing: npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
- [x] Update TODO.md to mark authentication complete

## Follow-up
- [x] Test full flow: register -> login -> access protected API -> UI session
