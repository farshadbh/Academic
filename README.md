# PhD Scholarship

A specialist job board for **PhD scholarships in structural and civil engineering** — fully funded PhD positions at Australian and international universities — plus a directory of supervisors and universities to help candidates find who works on their topic.

Live site: https://phd-scholarship.vercel.app (Vercel project to be created — see below)

Split from `farshadbh/structurajobaus` (SE Jobs Australia) on 2026-11-19: the original site carried academic and industry roles together, with PhD scholarships as one role inside its academic section. This repo is the PhD-scholarships half, completely separate from the `academic-position` repo. Industry roles were removed completely in the split; this repo publishes PhD scholarships only. The supervisor/academics directory (`/supervisors`, `/universities`, `/academic/people`) moved here with it, because a PhD hunt starts with "who works on this?".

## Scholarships in this snapshot

`data/jobs.json` is the live snapshot refreshed daily by `scripts/ingest-jobs.mjs`, plus PhD scholarships collected directly from universities' official websites — see `data/phd-sources.md` for the source URL of every collected listing, the universities checked, and the date each was checked. A university with no open structural/civil PhD scholarship is recorded there as zero; listings are never invented and never copied from aggregators.

## Stack

- Next.js 16 (App Router, React 19) with Tailwind CSS 4
- TypeScript, pnpm
- Listings stored as a committed JSON snapshot (`data/jobs.json`) and refreshed daily
- Deployed on Vercel

## How the daily update works

1. `.github/workflows/refresh-jobs.yml` runs at **19:00 UTC every day** = 06:00 in Sydney during daylight saving (AEDT, UTC+11).
2. `scripts/ingest-jobs.mjs` queries the configured job APIs for PhD scholarships only, normalises each ad, filters out anything whose role is not `phd-scholarship`, and rewrites `data/jobs.json`. Every source is optional and skipped when its key is absent.
3. The workflow commits the snapshot. Vercel rebuilds on push, so the site reflects the new ads without any manual step.
4. Expired listings are dropped at build time (`closingDate` in the past).

Run it manually any time:

```bash
pnpm ingest
```

## Universities worldwide (/universities) and QS

The list is the **QS World University Rankings top 500, in rank order 1–500** — every row shows the QS rank, university name, country and official site link. The ranks are a committed snapshot in `data/qs-2027.ts` (read by `lib/universities.ts`); there is no free public QS API, and QS blocks automated fetching of the published table, so the ranks are **not** scraped at build time.

Keeping it current:

- `.github/workflows/refresh-qs.yml` runs every Monday and `scripts/refresh-qs.mjs` checks topuniversities.com for a newer QS edition, recording the result in `data/qs-status.json`. The page always shows which QS edition the ranks come from and the date of the last check, and shows a banner when a newer edition is detected.
- When a new edition is detected, the one manual step is: open the published QS table on topuniversities.com, copy the new top 500 (rank | university | country, one per line) into `data/qs-2027.ts` in the existing format, verify each official website as before, then bump the edition year in `scripts/refresh-qs.mjs` (`CURRENT_EDITION`) and in `lib/universities.ts` if needed. The script logs clearly when the QS site cannot be reached automatically, so a failed check never breaks the build or silently rewrites the ranks.

## Find a supervisor (/supervisors)

Professors across **all fields** — every engineering branch, medicine, the natural and social sciences, the humanities, business, law and education — separated by field with the same filters as before. Every entry is transcribed from the university's own official staff/profile page: name, research focus, email and ORCID appear only where the university published them (never invented; unpublished email stays "Email not published" with the profile link). The "Profile" button on every professor links to their official university profile page.

The CV upload is read in the browser only (never uploaded) and fills the enquiry email template, which opens in Gmail/Outlook via mailto and says the CV is attached — the student attaches the file themselves in their mail app, since a mailto link cannot attach a file. The uploaded CV is **never** analysed to recommend or match professors.

## Accounts, saved lists and email alerts

Visitors can create a free account (`/signup`) and build **lists** — saved searches with keywords, city, state, minimum salary and visa sponsorship. Each account chooses a daily, weekly or monthly email; `scripts/send-digests.mjs` sends one email per period, and only when something new matches.

| Piece | Service | Free tier |
| --- | --- | --- |
| Accounts, lists, preferences | Upstash Redis (REST API) | 256 MB, 10k commands/day |
| Email delivery | Brevo | 300 emails/day |
| Scheduling | GitHub Actions `send-digests.yml` | free on public repos |

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

See `.env.example` for the variables (Careerjet, Jooble, optional Adzuna, Upstash Redis, `AUTH_SECRET`, Brevo). Add the API keys under **GitHub → Settings → Secrets and variables → Actions**, then run *Actions → Refresh job listings → Run workflow* once.

## Still to do before go-live

- Create a Vercel project from this repo (or import it) and set `NEXT_PUBLIC_SITE_URL` to the production host.
- Set the GitHub Actions secrets and the Vercel env vars from `.env.example`.

## Checks

```bash
pnpm typecheck
pnpm build
```

CI (`.github/workflows/ci.yml`) runs both on every push and pull request.
