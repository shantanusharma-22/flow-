# Bug Reports: Flow Desktop Music Player

Testing Period: 2026-10-19
Build: `3b99a81`
Total Bugs Discovered: 3 | S1: 0 | S2: 2 | S3: 1 | S4: 0
Resolved & Verified: 3 / 3 (100% Closed)

---

### BUG-001: SQLite Parameter Binding Error on Missing Search Limit

- **Severity**: S2
- **Flow / Case**: F01 / F01-H1
- **Screen**: S02 (Search & Catalog)
- **Build**: `3b99a81`

**Steps**:
1. Invoke `GET /api/search?q=Synth` without explicit `&limit=` query parameter.
2. Server attempted `parseInt(undefined, 10)` which yielded `NaN`.
3. `node:sqlite` threw `TypeError: Provided value cannot be bound to SQLite parameter 4`.

**Expected**: Default limit of 20 tracks should apply when not specified.
**Actual**: HTTP 500 Internal Server Error returned.
**Evidence**: Server log `[Flow Server Error]: TypeError: Provided value cannot be bound to SQLite parameter 4`.
**Fix**: Added `const parsedLimit = Number(req.query.limit); const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20;` in `server/routes/search.ts`.
**Status**: Fixed & verified by automated test `F01-H1`.

---

### BUG-002: SQLite Syntax Error on String Literal `datetime("now")`

- **Severity**: S2
- **Flow / Case**: F04 / F04-H1, F05 / F05-H2
- **Screen**: S08 (Downloads) & S09 (Settings)
- **Build**: `3b99a81`

**Steps**:
1. Call `POST /api/tracks/track-04/download` or `POST /api/integrations/scrobble`.
2. Update query executed with double-quoted `"now"`.
3. SQLite interpreted `"now"` as a table column rather than a string literal.

**Expected**: Track should be flagged as downloaded/cached with current timestamp.
**Actual**: `ERR_SQLITE_ERROR: no such column: "now" - should this be a string literal in single-quotes?`.
**Evidence**: Server log in task-403.
**Fix**: Replaced all instances of `datetime("now")` with single-quoted `datetime('now')` in `server/routes/tracks.ts` and `server/routes/integrations.ts`.
**Status**: Fixed & verified by automated tests `F04-H1` and `F05-H2`.

---

### BUG-003: Express 5 `req.query` Property Reassignment in Validation Middleware

- **Severity**: S3
- **Flow / Case**: All API queries
- **Screen**: Global Middleware
- **Build**: `3b99a81`

**Steps**:
1. Any route with query schema validation invoked in Express 5.
2. `validate.ts` attempted `req.query = parsedQuery`.
3. Express 5 defines `req.query` as a getter without a setter on `IncomingMessage.prototype`.

**Expected**: Validated query parameters should be parsed and accessible on request.
**Actual**: TypeError thrown in validation handler.
**Fix**: Updated `validate.ts` to mutate existing `req.query` properties via `Object.assign(req.query, parsedQuery)` rather than replacing the getter reference.
**Status**: Fixed & verified across all query tests.
