import { link } from '@/fields/link'

import { Block } from 'payload'

export const LatestStories: Block = {
  slug: 'latestStoriesCarousel',
  interfaceName: 'latestStoriesCarousel',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
    },
    link({
      overrides: {
        name: 'viewAllLink',
      },
    }),
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts', // Replace with your actual products collection slug
      hasMany: true,
      required: true,
    },
  ],
}
