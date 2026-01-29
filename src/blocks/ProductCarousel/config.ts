import {
  InlineToolbarFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const ProductCarousel: Block = {
  slug: 'productCarousel',
  interfaceName: 'ProductCarouselBlock',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
    },
    {
      name: 'sectionDescription',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products', // Replace with your actual products collection slug
      hasMany: true,
      required: true,
    },
  ],
}
