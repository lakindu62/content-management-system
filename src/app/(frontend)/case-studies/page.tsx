import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive/CaseStudyArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      heroImages: true,
      seo: true,
      clientOverview: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Case Studies</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange currentPage={caseStudies.page} limit={12} totalDocs={caseStudies.totalDocs} />
      </div>

      <CollectionArchive posts={caseStudies.docs} />

      <div className="container">
        {caseStudies.totalPages > 1 && caseStudies.page && (
          <Pagination page={caseStudies.page} totalPages={caseStudies.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Case Studies`,
  }
}
