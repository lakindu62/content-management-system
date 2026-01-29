'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { CaseStudy } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardCaseStudyData = Pick<
  CaseStudy,
  'slug' | 'title' | 'heroImages' | 'seo' | 'clientOverview'
>

export const CaseStudyCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardCaseStudyData
  relationTo?: 'case-studies'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    doc,
    relationTo = 'case-studies',
    showCategories,
    title: titleFromProps,
  } = props

  const { slug, title, heroImages, seo, clientOverview } = doc || {}
  const { metaDescription, ogImage } = seo || {}

  // Use heroImages[0] as primary image, fallback to ogImage
  const primaryImage = heroImages?.[0]?.image || ogImage

  const titleToUse = titleFromProps || title
  const sanitizedDescription = metaDescription?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!primaryImage && <div className="">No image</div>}
        {primaryImage && typeof primaryImage !== 'string' && (
          <Media resource={primaryImage} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {showCategories && clientOverview?.clientName && (
          <div className="uppercase text-sm mb-4">{clientOverview.clientName}</div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {sanitizedDescription && (
          <div className="mt-2">
            <p>{sanitizedDescription}</p>
          </div>
        )}
      </div>
    </article>
  )
}
