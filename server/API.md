## API Overview

**Base URL:** `/api/v1`  
**Auth model:** JWT access + refresh tokens (cookies or `Authorization: Bearer <token>`), Redis-backed session cache and rate limiting.  
**Main resources:** auth, users, voice notes, transcriptions, notes, query, admin.

---

## Auth Routes (`/api/v1/auth`)

### `POST /api/v1/auth/signup`

- **Auth**: Public  
- **Body (JSON)** – validated via `registerSchema`:
  - `email: string` (valid email)
  - `username: string`
  - `password: string`
- **Behavior**:
  - Normalizes email to lowercase.
  - Fails if user with this email already exists.
  - Redis-based rate limit key `register-rate-limit:<ip>:<email>`; 1 attempt per 60 seconds.
  - Creates `User` with `passwordHash`, `verificationToken`, `verificationTokenExpiresAt`.
  - Generates access and refresh tokens via `generateTokenAndSetCookie`, sets them in cookies.
- **Success (201)**:
  - `success: true`
  - `user`: user object (without `passwordHash`)
  - `access_token: string`
  - `refresh_token: string`
  - `message: "Registration Successful"`
- **Errors**:
  - `422` – validation error (zod)
  - `400` – missing fields or user already exists
  - `429` – too many registration attempts
  - `503` – server error

### `POST /api/v1/auth/verify/:token`

- **Auth**: Public  
- **Params**:
  - `token: string` – email verification token
- **Behavior**:
  - Looks up `verify-token:<token>` in Redis (data includes `email`, `username`).
  - Reads corresponding user by email.
  - If already verified, returns success.
  - Otherwise sets `isVerified = true`, `verifiedAt = now`.
- **Success (200)**:
  - `success: true`
  - `message: "Account verified successfully"` or `"User already verified"`
- **Errors**:
  - `400` – missing/invalid/expired token
  - `404` – user not found
  - `500` – server error

### `POST /api/v1/auth/login`

- **Auth**: Public  
- **Body (JSON)** – validated via `loginSchema`:
  - `email: string`
  - `password: string`
- **Behavior**:
  - Normalizes email.
  - Uses `login-rate-limit:<ip>:<email>` key in Redis:
    - If attempts ≥ 5 → `429` for 10 minutes.
  - Finds user by email and compares password with `passwordHash` via bcrypt.
  - On success:
    - Clears rate-limit key.
    - Generates access + refresh tokens and sets them as cookies.
- **Success (201)**:
  - `success: true`
  - `user`: user object (without `passwordHash`)
  - `access_token: string`
  - `refreshToken: string` (note: camelCase here)
  - `message: "Login Successful"`
- **Errors**:
  - `400` – validation or missing `email`/`password`
  - `401` – invalid credentials
  - `404` – invalid credentials (no user)
  - `429` – too many attempts
  - `503` – server error

### `POST /api/v1/auth/logout`

- **Auth**: Requires auth (`isAuth`)  
- **Behavior**:
  - Uses `revokeRefreshToken(userId)` to revoke refresh token(s) in Redis.
  - Reads signed `refreshToken` cookie; if none, returns `204`.
  - Clears `refreshToken` cookie (signed, httpOnly, secure in production, sameSite `Strict`) and `accessToken` cookie.
- **Success (200)**:
  - `{ message: "Logged out successfully" }`
- **Errors**:
  - `204` – no refresh token cookie
  - `503` – server error

### `GET /api/v1/auth/me`

- **Auth**: Requires auth (`isAuth`)  
- **Behavior**:
  - Returns `req.user` populated by `isAuth` (fetched from Redis cache or DB).
- **Success (200)**:
  - Raw user object.

### `POST /api/v1/auth/refresh-token`

- **Auth**: Uses refresh token; not protected by `isAuth`  
- **Behavior**:
  - Reads `refreshToken` from `req.signedCookies.refreshToken` or `req.cookies.refreshToken`.
  - Verifies via `verifyRefreshToken` and `jwt.verify`.
  - Ensures token belongs to an existing user.
  - Generates new `accessToken`.
- **Success**:
  - `accessToken: string` (primary useful field)
- **Errors**:
  - `403` – missing/invalid/unauthorized refresh token
  - `503` – server error

---

## User Routes (`/api/v1/users`)

All routes use `router.use(isAuth)` → **auth required**.

### `GET /api/v1/users/me`

- **Auth**: Required  
- **Behavior**:
  - Finds user by `req.user._id` and excludes password field.
- **Success (200)**:
  - `{ success: true, user }`
- **Errors**:
  - `404` – user not found
  - `503` – server error

### `PATCH /api/v1/users/me`

- **Auth**: Required  
- **Body (JSON)** – validated with `userSchema`:
  - `username?: string` (min length 3)
  - `email?: string` (valid email)
- **Behavior**:
  - If neither `username` nor `email` present → `400`.
  - Updates current user and returns updated user (excluding password).
- **Success (200)**:
  - `{ success: true, user }`
- **Errors**:
  - `400` – validation error or no data to update
  - `404` – user not found
  - `503` – server error

### `DELETE /api/v1/users/me`

- **Auth**: Required  
- **Behavior**:
  - Deletes current user by `req.user._id`.
- **Success (200)**:
  - `{ success: true, message: "Account deleted" }`
- **Errors**:
  - `404` – user not found
  - `503` – server error

---

## Voice Notes Routes (`/api/v1/voice-notes`)

Router uses `router.use(isAuth)` → all routes **require auth**.

### `POST /api/v1/voice-notes/`

- **Auth**: Required  
- **Middlewares**:
  - `upload.single("audio")`
  - `embedLimiter` (5 requests per 60 seconds per user)
- **Request (multipart/form-data)**:
  - `audio` – file field, required
  - `duration` – optional numeric duration in seconds (string or number)
- **Behavior**:
  - Rejects if no file uploaded.
  - Creates `VoiceNote`:
    - `userId`
    - `filename` (original file name)
    - `duration`
    - `s3Key`, `s3Url`
    - `contentType`
    - `size`
    - `status: "UPLOADED"`
  - Starts background transcription job: `startTranscriptionJob(voiceNoteId, userId)`.
- **Success (201)**:
  - `success: true`
  - `message: "Audio received"`
  - `voiceNoteId: string`
- **Errors**:
  - `400` – no file uploaded
  - `429` – rate limit exceeded (`embedLimiter`)
  - `503` – server error

### `GET /api/v1/voice-notes/`

- **Auth**: Required  
- **Behavior**:
  - Uses `getAllVoiceNotesForUser(userId)` to fetch all voice notes for the user.
- **Success (200)**:
  - `success: true`
  - `count: number`
  - `data: VoiceNote[]`
  - `message: "Voice notes fetched successfully"`
- **Errors**:
  - `503` – server error

### `GET /api/v1/voice-notes/:id`

- **Auth**: Required  
- **Params**:
  - `id: string` – voice note ID
- **Behavior**:
  - Uses `getVoiceNoteFile(id, userId)` to retrieve file and metadata.
  - Sets:
    - `Content-Type: <contentType>`
    - `Content-Disposition: inline; filename="<filename>"`
  - Sends raw audio buffer (binary).  
  - Note: there is an extra JSON `res.status(200).json(...)` after `res.send`, but clients should treat this endpoint as binary audio.
- **Usage from frontend**:
  - Use `fetch` with `response.arrayBuffer()` or `<audio>` tag; do not expect JSON.
- **Errors**:
  - `503` – server error; other status codes likely from the service.

### `DELETE /api/v1/voice-notes/:id`

- **Auth**: Required  
- **Params**:
  - `id: string` – voice note ID
- **Behavior**:
  - Calls `deleteVoiceNoteFile(id, userId)` to remove file and related DB record.
- **Success (200)**:
  - `{ success: true, message: "Voice Note deleted successfully" }`
- **Errors**:
  - `503` – server error

---

## Transcription Routes (`/api/v1/transcriptions`)

### `GET /api/v1/transcriptions/:id`

- **Auth**: Required (`isAuth`)  
- **Mounted route**:
  - `router.get("/:id", isAuth, transcriptionController.getTranscriptionById);`
- **Controller behavior**:
  - Expects `noteId` param:
    - `const { noteId } = req.params;`
  - Queries `Transcription.find({ noteId })` (note: model uses `voiceNoteId`; there is a naming mismatch in code, but conceptually this is “get transcription(s) for an associated id”).
- **Success (200)**:
  - `success: true`
  - `transcriptions: Transcription[]`
- **Errors**:
  - `404` – no transcriptions found for this id
  - `503` – server error

*(Create/update/delete transcription endpoints exist only as commented-out code.)*

---

## Notes Routes (`/api/v1/notes`)

### `POST /api/v1/notes/generate`

- **Auth**: Required (`isAuth`)  
- **Middlewares**:
  - `notesLimiter` (10 requests per 60 seconds per user)
- **Body (JSON)**:
  - `transcriptionId: string` – ID of a transcription
- **Behavior**:
  - Uses `notesGenerator(transcriptionId, userId)` to generate structured notes from a transcription.
  - Underlying `Note` model fields:
    - `userId`
    - `transcriptionId` (unique per note)
    - `title`
    - `summary`
    - `bulletPoints: string[]`
    - `actionItems: string[]`
- **Success (200)**:
  - `succcess: true` (note: typo in key)
  - `message: "Notes generated successfully"`
  - `data: Note | Note[]` (depending on service implementation)
- **Errors**:
  - `err.statuscode` – any custom status code thrown by service
  - `500` – fallback server error

### `GET /api/v1/notes/:id`

- **Auth**: Required  
- **Params**:
  - `id: string` – note ID
- **Behavior**:
  - Validates `id` present.
  - Finds `Note` with `{ _id: id, userId: req.user._id }`.
- **Success (200)**:
  - `{ success: true, data: note }`
- **Errors**:
  - `400` – missing `id`
  - `404` – note not found
  - `500` – server error

---

## Query Routes (`/api/v1/query`)

### `POST /api/v1/query/`

- **Auth**: Required (`isAuth`)  
- **Middlewares**:
  - `queryLimiter` (30 requests per 60 seconds per user)
- **Body (JSON)**:
  - `question: string`
- **Behavior**:
  - Validates `question` is present.
  - Calls `answerGenerationService({ userId, question })`.
  - This service likely runs a RAG/prompting pipeline using:
    - `Transcription`
    - `Note`
    - `Chunk` embeddings (see `chunks.model.js`)
- **Success (200)**:
  - `{ success: true, data: result }` – where `result` is the full answer payload from the service.
- **Errors**:
  - `400` – missing `question`
  - `500` – server error
  - `429` – rate limit exceeded (`queryLimiter`)

---

## Admin Routes (`/api/v1/admin`)

Router stack:

- `router.use(isAuth);`
- `router.use(requireAdmin);`

So all routes **require**:

- Authenticated user
- `req.user.role === "ADMIN"`

### `GET /api/v1/admin/`

- **Auth**: Admin only  
- **Behavior**:
  - Fetches all users, excluding `passwordHash`.
- **Success (200)**:
  - `{ success: true, users: User[] }`
- **Errors**:
  - `500` – fetch failure

### `GET /api/v1/admin/:id`

- **Auth**: Admin only  
- **Params**:
  - `id: string` – user ID
- **Behavior**:
  - Fetches user by ID, excludes `passwordHash`.
- **Success (200)**:
  - `{ success: true, user }`
- **Errors**:
  - `404` – user not found
  - `500` – fetch failure

### `PATCH /api/v1/admin/:id`

- **Auth**: Admin only  
- **Params**:
  - `id: string` – user ID
- **Body (JSON)**:
  - `username?: string`
  - `email?: string`
  - `phone_number?: string`
  - `role?: "USER" | "ADMIN"`
  - `isVerified?: boolean`
- **Behavior**:
  - Builds an `updates` object from provided fields.
  - Applies `$set: updates` via `findByIdAndUpdate`.
  - Returns updated user, excluding `passwordHash`.
- **Success (200)**:
  - `{ success: true, user }`
- **Errors**:
  - `404` – user not found
  - `409` – duplicate key (e.g. email conflict)
  - `500` – update failure

### `DELETE /api/v1/admin/:id`

- **Auth**: Admin only  
- **Params**:
  - `id: string` – user ID
- **Behavior**:
  - Deletes user by ID.
- **Success (200)**:
  - `{ success: true, message: "User deleted" }`
- **Errors**:
  - `404` – user not found
  - `500` – delete failure

---

## Middleware and Cross-Cutting Concerns

### `isAuth` (auth middleware)

- **Token sources**:
  - `req.cookies.accessToken`
  - `req.signedCookies.accessToken`
  - `Authorization: Bearer <token>` header
- **Behavior**:
  - Verifies JWT with access token secret.
  - Looks up cached user in Redis key `user:<userId>`.
  - If missing, fetches from DB via `User.findById(decoded.userId).select("-password")`.
  - Caches user in Redis for 1 hour.
  - Sets `req.user` and calls `next()`.
- **Failure**:
  - `401` – invalid/expired token or user missing
  - `500` – token verification error

### Rate limiters

- Implemented via `createRateLimiter(service, limit, windowInSeconds)` and Redis.
- Keys: `rate_limit:<service>:<userId>`.
- If attempts ≥ limit:
  - Responds with `429` and:
    - `message: "Rate limit exceeded. Try again after <minutes> minutes."`
- **Configured instances**:
  - `notesLimiter` – service `"notes"`, `limit = 10`, `window = 60` (10 per minute)
  - `queryLimiter` – service `"query"`, `limit = 30`, `window = 60` (30 per minute)
  - `embedLimiter` – service `"embedding"`, `limit = 5`, `window = 60` (5 per minute)

### `requireAdmin`

- **Behavior**:
  - Ensures `req.user` exists and `req.user.role === "ADMIN"`.
  - Otherwise:
    - `401` – if no `req.user`
    - `403` – if role is not `"ADMIN"`

---

## Typical Frontend Flows

### Auth flow

1. **Signup:** `POST /auth/signup` with `{ email, username, password }` → get user and tokens.
2. **Verify email:** `POST /auth/verify/:token` from verification link.
3. **Login:** `POST /auth/login` → access + refresh tokens set (cookies).
4. **Get current user:** `GET /auth/me` or `GET /users/me`.
5. **Refresh token:** `POST /auth/refresh-token` when access token expires.
6. **Logout:** `POST /auth/logout` to revoke refresh token and clear cookies.

### Recording → transcription → notes flow

1. **Upload audio:** `POST /voice-notes/` with `audio` file and `duration` → returns `voiceNoteId`.
2. **Background job:** server transcribes audio and stores `Transcription` and `Chunk` records.
3. **Generate notes:** `POST /notes/generate` with `{ transcriptionId }` → AI-generated note object.
4. **Fetch notes:** `GET /notes/:id` to retrieve specific structured note.

### Question answering (query) flow

1. **Ask question:** `POST /query` with `{ question }`.
2. **Receive answer:** `{ success: true, data: result }` where `result` is the RAG/LLM response, likely using user’s own content (transcriptions, notes, chunks).

