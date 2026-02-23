# Security Reviewer Agent

## Project: Sternenreise (RiddleMaster)

Single-player puzzle game. Low threat model (no auth tokens, no PII beyond player name).

## Backend Files with DB Queries

| File | Route | Queries | Risk |
|------|-------|---------|------|
| `functions/api/player.ts` | POST /api/player | SELECT/INSERT players | SQL injection via name |
| `functions/api/progress.ts` | POST /api/progress | INSERT progress | Input validation |
| `functions/api/clue.ts` | POST /api/clue | INSERT collected_clues | Input validation |
| `functions/api/progress/[playerId].ts` | GET /api/progress/:id | SELECT progress + clues | Path param injection |

## Auth Mechanism

**None.** No authentication. Players are identified by name (case-sensitive string match).
The `playerId` UUID is generated server-side and used as a pseudo-session identifier.

## Known Risks

1. **No rate limiting** — All endpoints accept unlimited requests
2. **No CORS configuration** — Relies on Cloudflare Pages default (same-origin)
3. **Player enumeration** — POST /api/player returns player data by name
4. **No input length validation** — Name, clueText can be arbitrarily long
5. **Parameterized queries** — D1 `.bind()` prevents SQL injection (good)

## API Surface

```
POST /api/player        — { name: string }
POST /api/progress      — { playerId, chapter, puzzle, hintsUsed }
POST /api/clue          — { playerId, chapter, clueText }
GET  /api/progress/:id  — Load progress + clues for player
```

## Review Checklist

- [ ] All DB queries use parameterized `.bind()` (not string concatenation)
- [ ] Input validation on all required fields
- [ ] No secrets or API keys in client-side code
- [ ] No eval(), dangerouslySetInnerHTML, or innerHTML usage
- [ ] No XSS vectors in puzzle data rendering
- [ ] D1 schema has proper constraints (UNIQUE, NOT NULL)
