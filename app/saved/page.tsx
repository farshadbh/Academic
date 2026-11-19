import type { Metadata } from 'next'
import { SavedJobsView, type SavedJobItem } from '@/components/live/saved-jobs-view'
import { PageHeader } from '@/components/page-header'
import { getAcademicPositions } from '@/lib/academic-positions'
import { getJobs } from '@/lib/jobs'

export const metadata: Metadata = {
  title: 'Saved jobs',
  description: 'PhD scholarships and academic positions you bookmarked on this device.',
  alternates: { canonical: '/saved' },
  // A personal list, not a page for search engines.
  robots: { index: false, follow: true },
}

/**
 * Saved roles live in the visitor's browser (localStorage), so this page
 * loads every role on the server and the client view filters to the saved
 * ids. Academic positions link out to the original posting, like everywhere
 * else on this site.
 */
export default async function SavedPage() {
  const [phdJobs, positions] = await Promise.all([getJobs(), getAcademicPositions()])
  const items: SavedJobItem[] = [
    ...phdJobs.map((job) => ({ job })),
    ...positions.map((job) => ({ job, href: job.applyUrl })),
  ]

  return (
    <>
      <PageHeader
        eyebrow="Saved on this device"
        title="Saved jobs"
        description="Roles you bookmarked. They are stored in this browser only — sign in to keep favourites and filters on every device."
        breadcrumbs={[{ label: 'Saved jobs', href: '/saved' }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <SavedJobsView items={items} />
      </section>
    </>
  )
}
