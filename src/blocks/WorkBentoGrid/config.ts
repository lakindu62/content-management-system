import { link } from '@/fields/link'

import { Block } from 'payload'

export const WorkBentoGrid: Block = {
  slug: 'workBentoGrid',
  interfaceName: 'WorkBentoGrid',
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
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies', // Replace with your actual products collection slug
      hasMany: true,
      required: true,
    },
  ],
}
