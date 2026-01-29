import { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../../blocks/Banner/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { createBidirectionalHooks } from '../Hooks/BidirectionalHook'
import { canDeleteContent } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { imageSizeOptions } from '../Hooks/ValidateImageSizeHook/utils'
import { validateImagesOnPublish } from '../Hooks/ValidateImageSizeHook'

const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'publishedDate'],
    group: 'Content',
    description: 'Manage client case studies and success stories',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    concept: true,
    heroImages: true,
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
        description: 'The main title of the case study (e.g., "Google Nest Pop Up")',
      },
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
            // Client Overview Section
            {
              name: 'clientOverview',
              type: 'group',
              fields: [
                {
                  name: 'clientName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Client name (e.g., "Google")',
                  },
                },

                {
                  name: 'location',
                  type: 'text',
                  admin: {
                    description: 'Project location (e.g., "Manhattan, NY")',
                  },
                },
              ],
            },
            // Concept Section
            {
              name: 'concept',
              type: 'richText',
              label: 'Concept',
              admin: {
                description: 'Main concept or introduction paragraph',
              },
            },
            // Hero/Featured Images
            {
              name: 'heroImages',
              type: 'array',
              validate: validateImagesOnPublish(imageSizeOptions.hero),
              label: 'Hero Images',
              minRows: 1,
              maxRows: 3,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
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
            },

            // Testimonial
            {
              name: 'testimonial',
              type: 'group',
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  admin: {
                    description: 'Client testimonial quote',
                  },
                },
                {
                  name: 'author',
                  type: 'text',
                  admin: {
                    description: 'Name of the person giving testimonial',
                  },
                },
                {
                  name: 'role',
                  type: 'text',
                  admin: {
                    description: 'Role/title of the person',
                  },
                },
                {
                  name: 'company',
                  type: 'text',
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            // Flexible Content Sections (Lexical Editor approach)
            {
              type: 'group',
              label: 'Main Content Section',
              admin: {
                className: 'emphasized-section',
              },
              fields: [
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                        BlocksFeature({ blocks: [Banner, MediaBlock] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        HorizontalRuleFeature(),
                      ]
                    },
                  }),
                  admin: {
                    description: 'Main content for this section',
                  },
                },
              ],
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
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
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
            },
            {
              name: 'relatedIndustries',
              type: 'relationship',
              relationTo: 'industries',
              required: true,
            },
          ],
        },
        {
          label: 'SEO & Settings',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 160,
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
          // SEO and Metadata
        },
      ],
    },

    // Status and Publishing
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
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Case Study',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
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
          targetField: 'relatedCaseStudies',
        },
        {
          relationshipField: 'relatedIndustries',
          targetCollection: 'industries',
          targetField: 'relatedCaseStudies',
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

export default CaseStudies
