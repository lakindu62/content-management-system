'use client'
import React from 'react'
import { LayoutGrid } from '@/components/ui/layout-grid'
import { CMSLink } from '@/components/Link'
import { CaseStudy, Page, Post } from '@/payload-types'
import RichText from '@/components/RichText'

export interface WorkBentoGridProps {
  sectionTitle?: string
  viewAllLink?: {
    type?: ('reference' | 'custom') | null
    newTab?: boolean | null
    reference?:
      | ({
          relationTo: 'pages'
          value: string | Page
        } | null)
      | ({
          relationTo: 'posts'
          value: string | Post
        } | null)
    url?: string | null
    label: string
    appearance?: ('default' | 'outline') | null
  }
  caseStudies: CaseStudy[]
}

export const WorkBentoGrid: React.FC<WorkBentoGridProps> = (props) => {
  const { sectionTitle, viewAllLink, caseStudies } = props

  // Dynamically create skeleton components for each case study
  const createSkeletonComponent = (caseStudy: CaseStudy, index: number) => {
    return () => (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">{caseStudy.title}</p>
        <div className="font-normal text-base my-4 max-w-lg text-neutral-200">
          {caseStudy.concept && <RichText data={caseStudy.concept!} />}
        </div>
      </div>
    )
  }

  // Map case studies to cards with dynamic data
  const cards = caseStudies.map((caseStudy, index) => {
    const SkeletonComponent = createSkeletonComponent(caseStudy, index)

    // Get thumbnail URL from heroImages
    const thumbnail = caseStudy.heroImages?.[0]?.image?.url || ''

    // Alternate grid layout classes for visual variety
    const classNames = ['md:col-span-2', 'col-span-1', 'col-span-1', 'md:col-span-2']

    return {
      id: index + 1,
      content: <SkeletonComponent />,
      className: classNames[index % classNames.length],
      thumbnail: thumbnail,
    }
  })

  return (
    <div className="h-screen max-w-7xl mt-20 mx-auto">
      <h2 className="text-4xl font-bold">{sectionTitle}</h2>
      {viewAllLink && (
        <CMSLink appearance="inline" className="bg-white underline text-black " {...viewAllLink} />
      )}
      <LayoutGrid cards={cards} />
    </div>
  )
}
