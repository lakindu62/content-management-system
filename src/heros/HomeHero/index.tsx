'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HomeHero: React.FC<Page['hero']> = ({ links, images, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div className=" min-h-[calc(100vh-10.4rem)]  text-white" data-theme="dark">
      <div className="h-96 w-96 rounded-full bg-black absolute -top-[150px] z-10 -left-[150px] blur-[100px]"></div>
      <div className="max-w-7xl w-full  mx-auto  ">
        {richText && (
          <RichText className="mb-6 z-20 relative" data={richText} enableGutter={false} />
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex md:justify-center gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}

        <div className="flex flex-col absolute bottom-20 sm:flex-row  gap-6 max-w-3xl">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
            <div className="p-8">
              <h2 className="text-white  md:text-2xl  mb-2 font-interTight">Make Your Mark</h2>
              <p className="text-gray-400 text-lg">Lets build it</p>
            </div>
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {/* Card 2 */}

          <div className="p-8">
            <h2 className="text-white  md:text-2xl  mb-2 font-interTight">Think Big Go Big</h2>
            <p className="text-gray-300 text-lg">Make A Statement</p>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      <Carousel className=" -z-10 absolute w-full min-h-screen overflow-hidden  border  inset-0 ">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="">
                <div key={item.id}>
                  <div className="bg-black/30 absolute inset-0"></div>
                  <Media
                    imgClassName="-z-10 w-full h-full object-cover"
                    priority
                    resource={item.image}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
