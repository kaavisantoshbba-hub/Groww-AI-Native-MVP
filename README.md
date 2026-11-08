# SIP Studio — Next.js / Vercel

Educational prototype. Not investment advice. Sample data only.

**formal evaluation: in progress**

This is an independent student prototype, not an official Groww product. The helper is enabled when the server has `GEMINI_API_KEY`. No release flag or evaluation report disables it. A configured key is not proof that the provider connection, quota or model access works.

## What changed

- Three Gemini calls for supported questions: select relevant rules, draft a concise answer, independently check the draft. An answer is withheld if its checks fail.
- Official links come from the selected local rule records; the model cannot invent source URLs.
- The model defaults to `gemini-3.5-flash`. Set server-only `GEMINI_MODEL` to override it.
- One 50-second request deadline covers all three calls, including reading their response bodies. The Vercel route's `maxDuration` is 60 seconds; the browser waits up to 55 seconds. There are no automatic retries consuming another timeout budget.
- Temporary diagnostics identify selection, draft or check failures. Only allowlisted status names are exposed, never raw provider messages, keys or the user's question.
- The last eight user/assistant messages are retained for follow-ups. “I missed my SIP payment” asks only “Did the SIP amount leave your bank account?” A “yes” then asks the app status, rather than repeating the bank question. These two fixed clarifications are labelled as clarifications, not AI answers. Later answers use all three Gemini stages.
- Games remain entirely fixed-code. Their questions, hints, calculations, answer checking and recaps do not call AI. The separate helper and free-text practice expectation check use the backend.
- The requested education line and formal-evaluation status are visible in the shared screen header and helper. Glossary overlays also show the education line.

Practice calculations and sample outcomes stay in fixed code. The helper cannot see or change a real SIP, bank account or portfolio. It does not offer fund, amount or timing recommendations. Existing source conflicts remain visible; this update does not revalidate the underlying financial rules.

## Upload to GitHub, then Vercel — no terminal needed

Work in the **SIP MVP repository only**. Do not change the separate discovery engine.

1. Download this ZIP. On Windows, right-click it → **Extract All**. Open the extracted `sip-practice` folder. You should see `package.json`, `app`, `lib`, `tests` and `scripts`.
2. Open your MVP repository on GitHub. Remove the old static-deployment files before uploading: the old root `vercel.json` that sets `outputDirectory` to `public`, the old root `api/` folder, the old root `public/` folder, and the old root `index.html` if present. Use the file/folder menu → delete, then **Commit changes**. Git keeps earlier versions if you need them. If a folder has no delete option, delete its files individually. These instructions replace that older static app with Next.js.
3. Click **Add file → Upload files**. Drag **everything inside** the new `sip-practice` folder into GitHub. Do not upload the ZIP itself or a nested `sip-practice` folder. Commit the upload. `package.json`, `app/` and `lib/` must be at the repository's top level.
4. **Upload the NEW `public/` folder from this ZIP.** It contains the source document and offline preview, not the deployed application's homepage. Keep the NEW `app/api/helper/route.js`: that is the Next.js backend. It replaces the old root `api/` folder. Keep all `lib/`, `tests/` and `scripts/` files. Include `.gitignore` and `.env.example` if your file picker hides them; never upload `.env.local`.
5. In Vercel, open this MVP project's **Settings → Build and Deployment**. Set Framework Preset to **Next.js**. Set Root Directory to the repository root. Reset Build Command, Install Command and Output Directory overrides to the framework defaults. In particular, Output Directory must NOT be `public`. Do not add a new static `vercel.json`.
6. In **Settings → Environment Variables**, keep your existing server-side `GEMINI_API_KEY` available for **Production** (and Preview only if you want preview links to use AI). Optionally set `GEMINI_MODEL` to `gemini-3.5-flash`. Never use a `NEXT_PUBLIC_` prefix for the key. `AI_RELEASE_APPROVED` is unused and can be deleted. No key needs to be shared in chat or committed to GitHub.
7. Open **Deployments** and deploy/redeploy the latest GitHub commit after saving settings. Open the production website in a private window. It should be accessible without signing in. If Vercel shows a login gate, review that project's Deployment Protection for the production URL.

### Quick check after deployment

- Visit `/api/helper` after your production domain. `ready: true` means a key is configured, not that a live request has succeeded.
- Ask “What does AutoPay mean?” A successful generated answer displays **AI · AUTOMATED CHECK PASSED** and relevant official sources.
- In the same conversation, type “I missed my SIP payment”, then “yes”. The first asks whether money left your bank; the second asks the app status. Then give the status to test a generated, source-linked answer.
- If a request fails, note the temporary diagnostic code. For example, `selection:gemini_http_429_RESOURCE_EXHAUSTED` indicates a provider quota/rate-limit response. `configuration:missing_key` means the server environment has no usable key. No fallback paragraph should masquerade as a live AI answer.
- Play both games. They work without AI. The downloaded HTML is an **offline preview**: it cannot call the server helper. Use the deployed root website to test live AI.

## Run locally (optional, for a developer)

Use Node.js 22 or newer. From this folder:

```sh
npm ci
npm test
npm run eval
npm run build
npm start
```

For development use `npm run dev`. Set the key privately in `.env.local` when testing Gemini; `.gitignore` excludes it. `.env.example` lists variable names without a key. The games, dashboard and glossary work without credentials; the helper shows an explicit unavailable state.

## How the AI works, in plain words

The small source collection is in `lib/rules.mjs`. The first Gemini call retrieves the relevant rule IDs from that collection. The second writes a focused explanation using those rules and conversation context. The third reviews relevance, grounding, advice restrictions, unverified account claims and missing information. Fixed validation also rejects unknown rule IDs, missing citations, malformed output and incomplete responses. Only a checked answer is displayed, with links taken from our collection.

This is retrieval over a small rule collection, not a vector database or live web search. The AI can still make mistakes: an automated model check does not establish accuracy. It cannot verify live transaction status. Deterministic scope refusals and basic payment clarifications need no model call.

## Evaluation and evidence

`npm test` runs software tests, including a simulated Gemini provider. `npm run eval` runs 34 saved-guide/reference cases; it does not measure live AI accuracy. The question set in `tests/golden.mjs` and `tests/expectations.mjs` is for the MVP, separate from the discovery engine's review-tagging set. Review the draft expected answers by hand before calling them a human-labelled golden set.

To run paid live model evaluation privately:

```sh
node --env-file=.env.local scripts/evaluate.mjs --live
```

This writes `lib/live-evaluation.json` for review. The file is a report only, never a runtime gate. Inspect the actual answers for relevance, factual correctness, appropriate clarifications, safe refusals and citations; record failures/corrections in the Evidence Log. Do not publish an accuracy percentage from mock or saved-guide tests. The UI remains “formal evaluation: in progress”.

No live Gemini call or public Vercel deployment was performed for this package. See `QA.md` for the exact checks, `CHANGED_FILES.md` for the file list and `HANDOFF.md` for remaining work. No 12-month retention improvement has been demonstrated.

## Privacy and hosting limits

The key stays on the server. Live requests send the question, recent conversation and fictional practice context to Gemini. No chat history is intentionally stored by this app; progress is local to the browser. Provider/hosting logging policies are separate. Diagnostics do not echo raw errors or questions. Before wider use, add durable per-user rate limits and spending controls; those are not included in this prototype update.
