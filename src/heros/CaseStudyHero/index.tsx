import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { Media } from '@/components/Media'

export const CaseStudyHero: React.FC<{
  caseStudy: CaseStudy
}> = ({ caseStudy }) => {
  const { heroImages, title, clientOverview, publishedDate } = caseStudy

  const heroImage =
    Array.isArray(heroImages) && heroImages.length > 0 ? heroImages[0]?.image : undefined

  const clientName =
    typeof clientOverview === 'object' && clientOverview ? clientOverview.clientName : undefined
  const location =
    typeof clientOverview === 'object' && clientOverview ? clientOverview.location : undefined

  return (
    <div className="relative -mt-[12rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <p className="uppercase text-sm mb-2">{clientName || 'Client'}</p>
          {location && <p className="text-sm mb-6">{location}</p>}

          <div>
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {publishedDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>
                <time dateTime={publishedDate}>{formatDateTime(publishedDate)}</time>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
