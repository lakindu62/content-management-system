import { Block } from 'payload'

export const IndustryRowBlock: Block = {
  slug: 'industryRowBlock',
  interfaceName: 'IndustryRowBlock',
  fields: [
    {
      name: 'industries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      required: true,
    },
  ],
}
