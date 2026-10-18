# Love Notes / 恋爱小笺

Independent bilingual adult relationship quiz website. The original Test Garden repository and deployment are unchanged.

- Website: https://335083474.github.io/love-notes/
- English: https://335083474.github.io/love-notes/en/
- API: https://love-notes-api.test-garden.workers.dev

Five original quizzes: love expression (15 questions), relationship communication, conflict style, apology and repair, date-night preferences (12 questions each). Full results, result cards, opt-in result sharing, independent consented two-person comparison, MiniMax discovery and new quiz generation are available. No relationship success or scientific accuracy claims.

## Development

Node 22.16+, npm ci; npm test; npm run build:github; node scripts/check-github.mjs.

GitHub Pages serves the frontend. A separate Cloudflare Free Worker and D1 database store this site's records. MiniMax credentials are backend secrets only. The 50-call daily site cap limits calls, not a guaranteed provider spend amount. MiniMax usage can be billable. No credentials belong in this repo.

Native editorial pages contain canonical, reciprocal language alternatives, static text, FAQ, transparent scoring and app schema. Dynamic AI quizzes and comparison URLs are noindex. SEO eligibility does not mean verified Google indexing, rankings or AI citations. GitHub project robots.txt is not root-host crawler configuration.

Research priorities and evidence limits: docs/keyword-plan.md.
