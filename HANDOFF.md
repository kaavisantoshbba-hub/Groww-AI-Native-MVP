# SIP Studio — live helper handoff, 8 November 2026

The Next.js helper now runs whenever server-side GEMINI_API_KEY exists. No release flag or report is needed. Its generated-answer path has three Gemini stages: select rules, draft answer, independently check answer. Failed checks withhold the draft and show a safe temporary code. Source links are mapped from checked local rule IDs.

Default model: gemini-3.5-flash; GEMINI_MODEL overrides it. One 50-second deadline covers all provider calls; route maxDuration is 60 seconds. The browser waits up to 55 seconds.

The exact missed-payment question and yes/no follow-up use fixed clarification logic and preserve both-role history for later model responses. They are not labelled AI answers. Games are unchanged, fixed-code and independent of the helper.

formal evaluation: in progress

Read README.md for GitHub/Vercel migration and QA.md for checks. This package has not been deployed to the user's Vercel project and has not made a live Gemini call. A configured key alone does not prove connectivity. The live evaluation report remains not_run and cannot disable the helper.

Next: upload the complete project, remove obsolete static deployment configuration, redeploy with the existing server key, verify generated answers/citations publicly, then run and manually review the MVP evaluation set. Record real task feedback from target users. Do not label experienced-user feedback as first-time-user evidence or claim a measured retention benefit. Keep the discovery engine frozen.
