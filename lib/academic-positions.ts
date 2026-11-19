import dataset from '@/data/academic-positions.json'
import type { Job } from './types'

/*
 * Academic Position section — university positions from postdoc to professor
 * (lecturer, research fellow, head of school, ...), kept as a SEPARATE section
 * from the PhD scholarship listings.
 *
 * These live in data/academic-positions.json, NOT in data/jobs.json, so the
 * nightly PhD ingest (scripts/ingest-jobs.mjs) never touches them, and they
 * never leak into the PhD counts, hero stats, role categories or /jobs search.
 * They are shown on the home page (first section), on /academic-positions,
 * and linked from the header — in that order, before the PhD Scholarship
 * sections, with Find a supervisor last.
 */

interface AcademicPositionsFile {
  generatedAt: string | null
  source: string
  jobs: Job[]
}

const FILE = dataset as unknown as AcademicPositionsFile

const sydneyDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Australia/Sydney',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function today() {
  return sydneyDate.format(new Date())
}

function byNewest(a: Job, b: Job) {
  return b.postedAt.localeCompare(a.postedAt)
}

function isOpen(job: Job) {
  // No closing date means open until filled / rolling review: still open.
  return !job.closingDate || job.closingDate >= today()
}

const POSITIONS: Job[] = FILE.jobs.filter(isOpen).sort(byNewest)

export async function getAcademicPositions(): Promise<Job[]> {
  return POSITIONS
}
