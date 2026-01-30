import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { canDeleteContent } from '@/access/roles'
import { createBidirectionalHooks } from '../Hooks/BidirectionalHook'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'createdAt'],
    group: 'Content',
  },
  defaultPopulate: {
    pdfs: true,
    title: true,
  },
  access: {
    create: authenticated,
    delete: canDeleteContent,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main title for this resource collection',
      },
    },
    {
      name: 'relatedResourceCategory',
      type: 'relationship',
      relationTo: 'resource-categories',
      required: true,
      hasMany: true,
      // Remove the hooks from here
    },
    {
      name: 'pdfs',
      type: 'array',
      label: 'PDF Files',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'pdfTitle',
          type: 'text',
          required: true,
          admin: {
            description: 'Title/name for this PDF',
          },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: { contains: 'pdf' },
          },
          admin: {
            description: 'Upload PDF file',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional description for this PDF',
          },
        },
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
  // Move hooks here - at the COLLECTION level
  hooks: {
    afterChange: [
      ...createBidirectionalHooks([
        {
          relationshipField: 'relatedResourceCategory',
          targetCollection: 'resource-categories',
          targetField: 'relatedResources',
        },
      ]),
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
