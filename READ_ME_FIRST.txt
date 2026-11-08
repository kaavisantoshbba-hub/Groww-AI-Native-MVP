SIP DEFINITION AND SAFETY FIX — 8 November 2026

WHAT TO REPLACE
This ZIP is a targeted update, NOT the complete application. Each code file is complete, not a snippet.
Replace these files in your EXISTING GitHub project, at exactly these paths:
1. lib/provider.mjs — definition routing, evidence-format tolerance, specific rejection diagnostics.
2. app/page.jsx — one label change to show CHECKED DEFINITION · NO AI.
3. tests/provider.test.mjs — definition, rejection and safety regression tests.
4. tests/api.test.mjs — updates the missing-key test to use a question that requires AI.

Do not delete any folders or other files. Do not upload the ZIP itself.
Open the extracted folder, upload its app/, lib/ and tests/ folders into the existing repository root, replacing matching files, then commit. Check that the four files appear at the paths above. Let Vercel deploy that commit, or redeploy the latest commit. Keep your current environment variables. No key change is needed.
The older static-deployment migration instructions do NOT apply to this targeted update.

WHAT THE INVESTIGATION ACTUALLY FOUND
The previous code used check:answer_rejected for three different rejection mechanisms. The supplied files contain no record of the generated drafts or reviewer results from your four live failures. It is therefore not possible to identify their exact rejecting check from that old error message. I have not guessed a cause or claimed to reproduce those live failures.

Offline reproduction: a valid AutoPay explanation passes the existing local unsafeDraft check and can pass the old evidence check with a perfectly formatted report. Removing only the final full stop from the reviewer's copy of the answer causes the old validClaimEvidence check to reject it. This proves a formatting-related failure is possible, not that it caused your four failures.

HOW IT IS FIXED
Exact definition-only questions about SIP, instalment/installment, units, allotment, AutoPay/AutoPay mandate, skip, cancel SIP, redeem/redemption and payment pending now use the supplied glossary/rules document. They are labelled CHECKED DEFINITION · NO AI and link to the relevant source pages. They work even without a provider key. Pending is explained as ambiguous; it is not diagnosed as failed or processed.
Mixed questions such as “What is AutoPay and how do I disable it?” do not match the definition shortcut. They still go through the existing checks. Advice and privacy guards run before definitions. Practice expectation checks also keep their existing checked AI path.

For other generated answers, the checker accepts differences in punctuation, spacing, case, sentence grouping and claim order. It no longer requires a 12-character exact quote for every sentence. It still requires real source excerpts (at least two words), valid cited rule IDs, complete answer-word coverage, and all five independent reviewer flags to be true. Words, numbers and negations are not discarded from coverage checks. A genuine quote does not by itself prove that a claim is supported: the independent grounded check must still pass.

Every original unsafeDraft rule is unchanged. No stays-active promise, firm yes on conflicting deadlines, unsupported support/manual-switch instructions, invented redemption wait, advice or urgency is permitted. These restrictions remain in local checks where originally present and in the independent review prompts/flags. Skip + active-status questions now receive a fixed cautious reply instead of a model promise.

TEMPORARY DIAGNOSTICS
check:unsafeDraft — the existing local safety rules rejected the draft.
check:reviewer:grounded — the independent model marked grounding false or omitted that flag.
check:reviewer:relevant,noAdvice — these named reviewer flags failed. Only known flag names are printed.
check:validClaimEvidence:missing_coverage — the evidence report did not cover the whole answer.
check:validClaimEvidence:quote_not_in_source — a claimed supporting quote was not present in the cited source.
check:validClaimEvidence:unknown_rule — the report named an uncited/unknown rule.
Other validClaimEvidence details distinguish missing claims, trivial quotes, non-matching answer spans and invalid clarification reports.
selection:provider_refusal (or draft/check equivalent) — the model provider refused rather than returning the expected answer object.
These codes contain no key, question, draft or raw provider message.

For the new “What is AutoPay?” path, none of those model checks can block it: the exact definition is returned without AI. For another question that fails after deployment, its new diagnostic will identify the rejecting mechanism. It does not automatically imply the safety check is wrong.

TESTED
126/126 offline automated tests passed, including mocked Groq and Gemini paths, shared deadline/retry behaviour, history, all previous unsafeDraft regressions, new diagnostics and no-secret output.
Production Next.js build passed against the existing project plus these replacement files.
A built local server, with NO real keys, answered the four requested definitions with sources, returned fixed caution for cancellation tomorrow and skip/active status, and declined “Which fund should I buy?”. A question requiring AI correctly reported the missing connection.

NOT TESTED / NOT CLAIMED
No live Groq or Gemini request was made for this fix, and your hosted site was not changed. Actual free-form model quality, live quota, the historical failure stage and the number of affected live questions are not established by these tests. No new browser/phone visual QA was performed. Formal evaluation remains in progress. No AI accuracy or retention improvement is claimed.
The underlying source document itself labels definitions for manual review; these tests do not establish independent human approval of all financial rules.

QUICK CHECK AFTER DEPLOYMENT
Ask “What is AutoPay?” — expect CHECKED DEFINITION · NO AI, a short explanation and official source links.
Ask “What does instalment mean?” and “What is redeem?” — same label, corresponding definition.
Ask “Can I cancel my SIP tomorrow?” — expect a fixed explanation of conflicting timing, never a firm yes.
Ask “Which fund should I buy?” — expect a refusal to recommend.
Ask another educational question requiring interpretation — it still uses your existing live AI provider. If rejected, note the new diagnostic code; do not share keys.

SCOPE
No game AI was added in this update. The game work was paused at your request to change only this answer-rejection issue. Games, rules files, API route, provider selection, model defaults, shared timeout, retry policy, source document and other features are unchanged. Only the four files above should be replaced.
