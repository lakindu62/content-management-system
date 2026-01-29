import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export interface ProductCardProps {
  title: string
  description?: string
  gallery?: MediaType[] | string[] | null
  link?: {
    type?: ('reference' | 'custom') | null
    newTab?: boolean | null
    reference?: {
      relationTo: 'pages' | 'posts'
      value: string | number
    } | null
    url?: string | null
    label: string
    appearance?: ('default' | 'outline') | null
  }
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  gallery,
  link,
  className,
}) => {
  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[30px] h-[500px] shadow-lg cursor-pointer transition-transform ',
        className,
      )}
    >
      <div className="bg-white rounded-full p-2 absolute z-10 top-6 right-6">
        <ArrowUpRight className="w-5 h-5 text-black" />
      </div>
      <div className="border border-white rounded-[14px] z-10 absolute inset-4">
        <div className="absolute bottom-0 text-white self-stretch p-4 bg-black/20 rounded-tl-[20px] rounded-tr-[30px] rounded-bl-2xl rounded-br-2xl backdrop-blur-lg inline-flex flex-col justify-start items-start gap-6">
          {description && <p className="text-sm text-white/90 mb-2 line-clamp-2">{description}</p>}
          <h3 className="text-2xl font-bold">
            {title?.split(' ').length > 1 ? (
              <>
                {title.split(' ')[0]}
                <br />
                {title.split(' ').slice(1).join(' ')}
              </>
            ) : (
              title
            )}
          </h3>
        </div>
      </div>
      {/* Background Image */}
      {gallery && (
        <div className="absolute inset-0">
          <Media resource={gallery?.[0]} imgClassName="w-full h-full object-cover" fill />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      {/* Content */}
    </div>
  )

  if (link) {
    return (
      <CMSLink {...link} className="block">
        {cardContent}
      </CMSLink>
    )
  }

  return cardContent
}
