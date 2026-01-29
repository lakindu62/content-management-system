import { BrandManifesto } from '@/blocks/ BrandManifesto/config'
import { FormBlock } from '@/blocks/Form/config'
import { LatestStories } from '@/blocks/LatestStories/config'
import { CollectionConfig } from 'payload'
import { createBidirectionalHooks } from '../Hooks/BidirectionalHook'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { canDeleteContent } from '@/access/roles'

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Content',
  },
  access: {
    create: authenticated,
    delete: canDeleteContent,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    cardImage: true,
    cardDescription: true,
    heroImage: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'ourPartners',
              type: 'group',
              fields: [
                {
                  name: 'sectionTitle',
                  type: 'text',
                  required: false,
                },
                {
                  name: 'sectionDescription',
                  type: 'textarea',
                  required: false,
                },
                {
                  name: 'logos',
                  type: 'relationship',
                  relationTo: 'media',
                  hasMany: true,
                  label: 'Partner Logos',
                  required: true,
                },
              ],
            },

            {
              name: 'productsSectionImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'ideasInUse',
              type: 'array',
              required: false,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'ideasInUseImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [FormBlock, LatestStories, BrandManifesto],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: 'Card Content',
          fields: [
            {
              name: 'cardDescription',
              type: 'text',
              required: true,
              admin: {
                description: 'Short description for industry cards (max 150 characters). ',
              },
            },
            {
              name: 'cardImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description:
                  'Image for industry cards. If Not provided, the hero image will be used.',
              },
            },
          ],
        },
        {
          label: 'Related Content | References',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              required: true,
            },
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              relationTo: 'case-studies',
              hasMany: true,
              required: false,
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              required: false,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data && data.title && !data.slug) {
            data.slug = data.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
          }
        }
        return data
      },
    ],
    afterChange: [
      ...createBidirectionalHooks([
        {
          relationshipField: 'relatedProducts',
          targetCollection: 'products',
          targetField: 'relatedIndustries',
        },
        {
          relationshipField: 'relatedCaseStudies',
          targetCollection: 'case-studies',
          targetField: 'relatedIndustries',
        },
        {
          relationshipField: 'relatedPosts',
          targetCollection: 'posts',
          targetField: 'relatedIndustries',
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
