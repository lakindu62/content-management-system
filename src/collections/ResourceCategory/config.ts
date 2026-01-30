import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'
import { createBidirectionalHooks } from '../Hooks/BidirectionalHook'
import { validateImagesOnPublish } from '../Hooks/ValidateImageSizeHook'
import { imageSizeOptions } from '../Hooks/ValidateImageSizeHook/utils'

export const ResourceCategories: CollectionConfig = {
  slug: 'resource-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Axillary Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      validate: validateImagesOnPublish(imageSizeOptions.hero),
      admin: {
        components: {
          afterInput: ['@/custom/fields/ImageValidationAfterField.tsx'],
        },
        custom: {
          imageValidationConfig: imageSizeOptions.hero,
        },
      },
    },
    {
      name: 'heroGallery',
      type: 'array',
      validate: validateImagesOnPublish(imageSizeOptions.hero),
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,

          hooks: {
            beforeChange: [],
          },
          admin: {
            components: {
              afterInput: ['@/custom/fields/ImageValidationAfterField.tsx'],
            },
            custom: {
              imageValidationConfig: imageSizeOptions.hero,
            },
          },
        },
      ],
      required: true,
    },
    {
      name: 'relatedResources',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    afterChange: [
      ...createBidirectionalHooks([
        {
          relationshipField: 'relatedResources',
          targetCollection: 'resources',
          targetField: 'relatedResourceCategory',
        },
      ]),
    ],
  },
}
