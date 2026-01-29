import React from 'react'
import { cn } from '@/utilities/ui'

import { ProductCard } from '@/blocks/ProductCarousel/ProductCard'
import type { Product } from '@/payload-types'

type Props = {
  products: Product[]
}

export const ProductArchive: React.FC<Props> = ({ products }) => {
  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {products?.map((product, index) => {
            if (typeof product === 'object' && product !== null) {
              const normalizedGallery =
                Array.isArray(product.gallery) && product.gallery.length > 0
                  ? product.gallery.map((item) =>
                      item && typeof item === 'object' && 'value' in item ? item.value : item,
                    )
                  : undefined

              return (
                <div className="col-span-4" key={product.id || index}>
                  <ProductCard
                    className="h-full"
                    title={product.title || 'Untitled product'}
                    description={product.cardDescription || undefined}
                    gallery={normalizedGallery}
                    link={{
                      type: 'custom',
                      url: `/products/${product.id}`,
                      label: 'View product',
                      appearance: 'default',
                    }}
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}

