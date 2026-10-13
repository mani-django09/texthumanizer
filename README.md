# Text Humanizer

Source for [texthumanizer.site](https://texthumanizer.site): an AI text humanizer with a grammar checker, AI content detector and plagiarism checker.

- **frontend/** – Next.js 14 (App Router), Tailwind
- **backend/** – Express, PostgreSQL (SQL migrations in `backend/migrations/`)

## Run locally

```bash
# backend
cd backend && cp .env.example .env   # fill in values
npm install && node server.js

# frontend
cd frontend && cp .env.example .env.local
npm install && npm run dev
```

AI providers are tried in order Gemini → Groq → OpenAI. Plagiarism checks need a search key (`SERPER_API_KEY`, `TAVILY_API_KEY` or `BRAVE_SEARCH_API_KEY`). Billing uses LemonSqueezy (`LS_*` variables) and email uses Resend.
