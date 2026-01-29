import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { canDeleteContent } from '@/access/roles'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'createdAt'],
    group: 'Content',
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
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for this resource',
      },
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
        {
          name: 'fileSize',
          type: 'text',
          admin: {
            description: 'Optional file size (e.g., "2.5 MB")',
          },
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Guides', value: 'guides' },
        { label: 'Whitepapers', value: 'whitepapers' },
        { label: 'Reports', value: 'reports' },
        { label: 'Case Studies', value: 'case-studies' },
        { label: 'Brochures', value: 'brochures' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
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
