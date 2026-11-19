import { CityGrid } from '@/components/home/city-grid'
import { Hero } from '@/components/home/hero'
import { JobSection } from '@/components/home/job-section'
import { RoleCategories } from '@/components/home/role-categories'
import { JsonLd } from '@/components/json-ld'
import { SITE_NAME, SITE_URL } from '@/lib/format'
import { getFeaturedJobs, getJobCounts, getLatestJobs, getVisaSponsoredJobs } from '@/lib/jobs'

export default async function HomePage() {
  const [featured, academic, visa, counts] = await Promise.all([
    getFeaturedJobs(6),
    getLatestJobs('academic', 4),
    getVisaSponsoredJobs(4),
    getJobCounts(),
  ])

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/jobs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <Hero stats={counts} />
      <JobSection
        id="featured-jobs"
        eyebrow="Featured"
        title="Featured PhD scholarships"
        description="The newest funded PhD scholarships in structural and civil engineering."
        jobs={featured}
        href="/jobs"
        linkLabel="View all scholarships"
        columns={3}
      />
      <RoleCategories counts={counts.byRole} />
      <JobSection
        id="latest-academic"
        eyebrow="PhD Scholarship"
        title="Latest PhD scholarships"
        description="PhD scholarship opportunities at Australian and international universities."
        jobs={academic}
        href="/academic"
        linkLabel="All PhD scholarships"
      />
      <JobSection
        id="visa-jobs"
        eyebrow="Visa sponsorship"
        title="Scholarships open to international applicants"
        description="PhD scholarships open to international candidates."
        jobs={visa}
        href="/jobs?visa=1"
        linkLabel="All visa sponsored scholarships"
      />
      <CityGrid counts={counts.byCity} />
    </>
  )
}
