SIP HELPER SOURCE SUPPORT PATCH

This is a targeted update, NOT a replacement for your whole project.
It contains the COMPLETE contents of the two changed files:
  lib/provider.mjs
  tests/provider.test.mjs
No games, dashboard, rule files, API route, keys or model settings changed.

WHAT I OBSERVED ON YOUR LIVE SITE
https://groww-ai-native-mvpsip-studio-nextj.vercel.app/
1. What is AutoPay? Answered with CHECKED DEFINITION · NO AI.
2. How is cancelling a SIP different from redeeming my units?
   Failed with check:reviewer:grounded.
3. Why can an AutoPay debit fail? Answered with AI · AUTOMATED CHECK PASSED.
   It also added a Pay-option explanation; the revised instructions ask it to
   avoid unrelated next steps when only an explanation is requested.
4. How is cancelling different from redeeming?
   Failed with check:reviewer:grounded again.

The confirmed rejecting layer was the independent reviewer's grounded flag.
The live UI did not expose the rejected draft or the reviewer's reasoning, so
I cannot establish exactly which words triggered either live rejection.
These requests did not show a quota error. Other questions may fail differently.

WHAT CHANGED
The UI glossary already defines redeem as selling units to withdraw their value.
The old AI catalog only said investments remain until redeemed separately.
The full reviewed definition and its existing source links now reach selection,
drafting and independent review. Relevant existing glossary definitions are
also included for SIP, instalments, units and AutoPay. Original rule IDs remain.
The draft instructions ask for the requested comparison only, and forbid an
unsupported assertion about future SIP instalments after redemption.
The reviewer still must approve every flag; paraphrases must be supported.
The final source links include the glossary source used by the answer.
Fallback wording distinguishes failed answer checks from HTTP 429 limits.

SAFETY AND SCOPE
The local unsafeDraft and claim-evidence validation functions are unchanged.
No check was removed. Three calls per AI answer, one shared deadline, fixed
answers for definitions/deadlines, conversation memory and provider configuration
are preserved. Games remain unchanged. No automatic extra AI retries were added.
This patch does not guarantee every question passes or fix provider quota limits.

WHAT WAS TESTED
130 offline tests passed, including existing safety, definitions, memory,
provider failures and new source-plumbing regression tests.
Next.js production build passed with the patch.
The new comparison test uses simulated provider responses. It verifies source
support reaches all stages and the response keeps source links; it is NOT a
live AI accuracy measurement. No keys were requested or included.
The patched code has not been deployed or tested against live Groq/Gemini.

UPLOAD TO YOUR EXISTING GITHUB PROJECT
1. Extract this ZIP on your computer.
2. Open the EXISTING GitHub repository connected to this Vercel project.
3. Open its lib folder. Choose Add file > Upload files. Upload the enclosed
   lib/provider.mjs into that lib folder, then Commit changes.
4. Open its tests folder. Upload the enclosed tests/provider.test.mjs into
   that tests folder, then Commit changes.
5. Let Vercel finish the deployment for the latest commit. Wait for Ready.
6. Refresh the prototype and ask: How is cancelling different from redeeming?
   A live answer is labelled AI · AUTOMATED CHECK PASSED. A fixed definition
   is labelled CHECKED DEFINITION · NO AI. Do not count the latter as AI accuracy.
7. If the comparison falls back, copy its exact Temporary diagnostic code.

Do not delete any folders, do not upload the ZIP itself to GitHub, and do not
change your API keys. Upload these files inside their matching folders, not at
repository root. READ_ME_FIRST.txt need not be uploaded.
