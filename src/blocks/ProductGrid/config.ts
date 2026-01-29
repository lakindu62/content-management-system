import { Block } from 'payload'

export const ProductGrid: Block = {
  slug: 'productGridBlock',
  interfaceName: 'ProductGridBlock',
  fields: [
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
    },
  ],
}
