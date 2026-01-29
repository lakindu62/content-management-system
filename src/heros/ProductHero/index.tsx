import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const { title, cardDescription, gallery } = product

  const firstItem = Array.isArray(gallery) && gallery.length > 0 ? gallery[0] : undefined
  const heroImage =
    firstItem && typeof firstItem === 'object' && 'value' in firstItem ? firstItem.value : firstItem

  return (
    <div className="relative -mt-[12rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <p className="uppercase text-sm mb-2">{cardDescription || 'Product'}</p>

          <div>
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>
        </div>
      </div>

      <div className="min-h-[70vh] select-none">
        {heroImage && typeof heroImage !== 'object' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        {heroImage && typeof heroImage === 'object' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
