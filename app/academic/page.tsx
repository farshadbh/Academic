import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AcademicsSection } from '@/components/academics/academics-teaser'
import { SectorPage } from '@/components/jobs/sector-page'
import { isKnownRole, parseFilters } from '@/lib/jobs'
import { getRole } from '@/lib/taxonomy'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const filters = parseFilters(await searchParams)
  const roleName = filters.role ? getRole(filters.role)?.name : undefined

  const title = roleName
    ? `${roleName} in Structural Engineering Australia`
    : 'PhD Scholarships in Structural Engineering Australia'

  const otherFilters =
    filters.q || filters.city || filters.state || filters.salaryMin || filters.visa || filters.remote || filters.hybrid || filters.fullTime

  return {
    title,
    description: 'Browse PhD scholarships in structural and civil engineering, and find a supervisor.',
    alternates: { canonical: roleName ? `/academic?role=${filters.role}` : '/academic' },
    robots: otherFilters ? { index: false, follow: true } : { index: true, follow: true },
  }
}

export default async function AcademicPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams)
  if (!isKnownRole(filters.role)) notFound()

  // A PhD scholarship hunt starts with "who works on this?", so this site
  // always shows the supervisor directory under its listings.
  return (
    <>
      <SectorPage sector="academic" filters={filters} />
      <AcademicsSection />
    </>
  )
}
