# Validation — Next.js live-helper update, 8 November 2026

formal evaluation: in progress

## Passed for this package

- `npm ci --ignore-scripts`: installed the exact lockfile dependencies successfully.
- `npm test`: **65/65 software tests passed**, including simulated Gemini selection → draft → independent check, citation mapping, model override, key-only readiness, rejected answers, invalid evidence/JSON, truncated output, stage-specific HTTP errors, error redaction, network failure and shared cumulative deadline (including a stalled response body).
- Conversation tests: the exact missed-payment question asks one bank-deduction question; yes/no follows history; later app-status replies include both-role history in all three simulated provider calls. The route preserves that history.
- `npm run eval`: **34/34 saved-guide/reference checks passed**. These exercise existing fixed rules and expectations, not live Gemini answer accuracy.
- `npm run export:offline`: both included HTML previews regenerated. They clearly report offline AI unavailability instead of substituting saved paragraphs as AI answers.
- `npm run build`: production Next.js build passed with `/api/helper` as a dynamic server route.
- Production HTTP smoke: started the built server with a clearly fake test key, checked the homepage and exact educational/formal-evaluation notices, key-configured status, missed-payment → yes clarification flow, invalid null body, cross-origin rejection, and evaluation JSON asset. This smoke test did not make Gemini requests.
- Compared original ZIP bytes: `lib/games.mjs`, `app/learning-games.jsx`, `app/word-puzzle.jsx`, `lib/engine.mjs` and `lib/rules.mjs` are unchanged. Games contain no AI request code. The separate helper is not part of game scoring or explanations.

## Not tested / not claimed

- **No live Gemini request was made.** No real credential was available for this update; mocked calls do not prove model access, quota, provider latency, output accuracy or real conversation quality. Keys were not requested.
- No deployment to the user's Vercel/GitHub account was performed. Public login-free access and the real production environment still need checking after upload/redeployment.
- No new browser interaction, visual/mobile or physical-phone QA was performed for this update. Compilation and HTTP checks do not prove all UI interactions or layouts.
- No new financial-source verification, human-labelled accuracy score, user study or retention uplift was established.

## Release behaviour

There is no release-approval flag or report-based runtime switch. GEMINI_API_KEY enables requests. Each generated answer still has source-ID validation and an independent automated check; failures show a safe fallback with a temporary code. Formal evaluation remains in progress. Readiness is key presence, not a successful provider test.

The route has a 60-second maximum; all Gemini work shares one 50-second deadline and AbortController. The client timeout is 55 seconds. Calls are sequential, with no retry that resets the budget. Provider or hosting delays can still cause a visible fallback; this is expected, not an invented answer.
