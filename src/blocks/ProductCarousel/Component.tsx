'use client'

import React from 'react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { ProductCard } from './ProductCard'
import type { Media as MediaType } from '@/payload-types'

export interface ProductCarouselBlockProps {
  sectionTitle?: string
  sectionDescription?: {
    root: {
      type: string
      children: {
        type: any
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  products?: Array<{
    title: string
    cardDescription?: string
    gallery?: MediaType[] | string[] | null
    link?: {
      type?: ('reference' | 'custom') | null
      newTab?: boolean | null
      reference?: {
        relationTo: 'pages' | 'posts'
        value: string | unknown
      } | null
      url?: string | null
      label: string
      appearance?: ('default' | 'outline') | null
    }
    id?: string | null
  }> | null
  id?: string | null
  blockName?: string | null
  blockType?: 'productCarousel'
  disableInnerContainer?: boolean
}

import { type CarouselApi } from '@/components/ui/carousel'

export const ProductCarouselBlock: React.FC<ProductCarouselBlockProps> = ({
  sectionTitle,
  sectionDescription,
  products,
  disableInnerContainer,
}) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [scrollProgress, setScrollProgress] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    const onScroll = () => {
      const progress = Math.max(0, Math.min(1, api.scrollProgress()))
      setScrollProgress(progress * 100)
    }

    // Set initial progress
    onScroll()

    // Listen to scroll events
    api.on('scroll', onScroll)
    api.on('reInit', onScroll)

    return () => {
      api.off('scroll', onScroll)
      api.off('reInit', onScroll)
    }
  }, [api])

  return (
    <div className={cn(' max-w-7xl  mx-auto', { container: !disableInnerContainer })}>
      {/* Header Section */}
      <div className="text-center mb-12">
        {sectionTitle && <div className="mb-6 text-4xl font-medium">{sectionTitle}</div>}
        {sectionDescription && (
          <div className="max-w-3xl text-lg mx-auto">
            <RichText data={sectionDescription} enableGutter={false} />
          </div>
        )}
      </div>

      {/* Carousel Section */}
      {products && products.length > 0 && (
        <div className="relative ">
          <Carousel
            setApi={setApi}
            opts={{
              loop: false,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="">
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id || index}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard
                    title={product.title}
                    description={product.cardDescription}
                    gallery={product.gallery}
                    link={product.link}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious className="left-0 -translate-x-14 bg-gray-200 hover:bg-gray-300 border-0" />
            <CarouselNext className="right-0 translate-x-14 bg-gray-200 hover:bg-gray-300 border-0" /> */}
          </Carousel>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-200  h-[2px] overflow-hidden">
            <div
              className="bg-gray-400 h-full  transition-transform duration-200 ease-out"
              style={{
                transform: `translateX(${scrollProgress - 100}%)`,
                transformOrigin: 'left',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
