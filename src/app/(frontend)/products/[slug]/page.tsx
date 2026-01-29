import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Product } from '@/payload-types'

import { ProductHero } from '@/heros/ProductHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      id: true,
    },
  })

  const params = products.docs.map(({ id }) => {
    return { slug: id }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/products/' + decodedSlug
  const product = await queryProductById({ id: decodedSlug })

  if (!product) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ProductHero product={product} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container flex flex-col gap-8">
          {product.cardDescription && (
            <p className="max-w-[48rem] mx-auto text-center text-lg text-white/90">
              {product.cardDescription}
            </p>
          )}

          {Array.isArray(product.gallery) && product.gallery.length > 1 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {product.gallery.slice(1).map((item, index) => {
                const resource =
                  item && typeof item === 'object' && 'value' in item ? item.value : item

                if (!resource) return null

                return (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" key={index}>
                    <Media resource={resource} fill imgClassName="object-cover" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const product = await queryProductById({ id: decodedSlug })

  return generateMeta({ doc: product })
}

const queryProductById = cache(async ({ id }: { id: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.findByID({
    collection: 'products',
    id,
    draft,
    overrideAccess: draft,
  })

  return (result as Product | null) || null
})
