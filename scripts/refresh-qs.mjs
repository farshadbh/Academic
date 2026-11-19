#!/usr/bin/env node
/*
 * Check whether QS has published a newer World University Rankings edition
 * than the snapshot in data/qs-2027.ts, and record the outcome in
 * data/qs-status.json. The /universities page shows the edition and the date
 * of the last check from that file.
 *
 * The full QS table is not available through a public API, and
 * topuniversities.com is JavaScript-heavy, so this script does NOT pretend to
 * download the new ranks: it only detects that a new edition exists. When it
 * does, a person still has to transcribe the new top 500 from the published
 * table into data/qs-2027.ts (same care as the original snapshot — every
 * official website was requested and its page title checked) and bump the
 * edition in this script and in lib/universities.ts.
 *
 * Run weekly from .github/workflows/refresh-qs.yml, or manually:
 *   node scripts/refresh-qs.mjs
 */
import { writeFileSync } from 'node:fs'

const CURRENT_EDITION = 2027
const STATUS_PATH = new URL('../data/qs-status.json', import.meta.url)
const UA = 'Mozilla/5.0 (compatible; PhD-Scholarship-QS-check/1.0)'

async function fetchText(url, timeoutMs = 20000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: controller.signal })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    return { ok: true, text: await res.text() }
  } catch (error) {
    return { ok: false, error: String(error?.message ?? error) }
  } finally {
    clearTimeout(timer)
  }
}

/** Every "QS World University Rankings YYYY" mention on the page, newest first. */
function editionsMentioned(html) {
  const years = new Set()
  for (const match of html.matchAll(/QS World University Rankings\s+(20\d\d)/g)) {
    years.add(Number(match[1]))
  }
  return [...years].sort((a, b) => b - a)
}

const today = new Date().toISOString().slice(0, 10)
const sourcesTried = []
let latestSeen = null

const qs = await fetchText('https://www.topuniversities.com/qs-world-university-rankings')
sourcesTried.push({ source: 'topuniversities.com', ok: qs.ok, error: qs.ok ? undefined : qs.error })
if (qs.ok) {
  const editions = editionsMentioned(qs.text)
  if (editions.length > 0) latestSeen = editions[0]
}

const status = {
  edition: String(CURRENT_EDITION),
  checkedAt: today,
  latestEditionSeen: latestSeen,
  updateAvailable: latestSeen !== null && latestSeen > CURRENT_EDITION,
  checkOk: sourcesTried.some((entry) => entry.ok) && latestSeen !== null,
  sourcesTried,
  note:
    latestSeen !== null
      ? latestSeen > CURRENT_EDITION
        ? `QS has published the ${latestSeen} edition. Transcribe the new top 500 into data/qs-2027.ts and bump the edition in scripts/refresh-qs.mjs and lib/universities.ts.`
        : `No newer QS edition than ${CURRENT_EDITION} was found on topuniversities.com.`
      : 'The QS site could not be read from this run (blocked or unreachable), so no newer edition could be confirmed or ruled out. Check topuniversities.com by hand.',
}

writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + '\n')
console.log(JSON.stringify(status, null, 2))
