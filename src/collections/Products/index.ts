import { Banner } from '@/blocks/Banner/Banner/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import type { CollectionConfig } from 'payload'
import { createBidirectionalHook } from '../Hooks/BidirectionalHook'
import { FormBlock } from '@/blocks/Form/config'
import { canDeleteContent } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { validateImagesOnPublish } from '../Hooks/ValidateImageSizeHook'
import { imageSizeOptions } from '../Hooks/ValidateImageSizeHook/utils'

export const Products: CollectionConfig = {
  slug: 'products',
  defaultPopulate: {
    title: true,
    slug: true,
    heroGallery: true,
    cardDescription: true,
    cardImage: true,
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
          fields: [
            {
              name: 'cardImage',
              type: 'upload',
              relationTo: 'media',
              validate: validateImagesOnPublish(imageSizeOptions.card),
              admin: {
                description:
                  'Image for product cards. Rendered in the Second Section of the home page. If Not Provided, first image from the gallery will be used.',
                components: {
                  afterInput: ['@/custom/fields/ImageValidationAfterField'],
                },
                custom: {
                  imageValidationConfig: imageSizeOptions.card,
                },
              },
            },
            {
              name: 'cardDescription',
              type: 'text',
              admin: {
                description:
                  'Short description for product cards (max 150 characters). Rendered in the Second Section of the home page',
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
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
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
            {
              name: 'callToAction',
              label: 'Call To Action | Form',
              type: 'blocks',
              blocks: [FormBlock],
            },
          ],
          label: 'Content',
        },

        // FAQ TAB
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              label: 'Frequently Asked Questions',
              admin: {
                description: 'Add questions and answers for this product',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g., How do I install this product?',
                  },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                      ]
                    },
                  }),
                  admin: {
                    description: 'Detailed answer with formatting support',
                  },
                },
              ],
            },
          ],
        },

        // RELATED ARTICLES TAB
        {
          label: 'Related Content | References',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              admin: {
                description: 'Select related blog posts or articles for this product',
              },
            },
            {
              name: 'relatedIndustries',
              type: 'relationship',
              relationTo: 'industries',
              hasMany: true,
            },
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              relationTo: 'case-studies',
              hasMany: true,
            },
          ],
        },

        {
          label: 'SEO',
          fields: [
            {
              name: 'meta', // ✅ Add this group wrapper
              type: 'group',
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  hooks: {
    afterChange: [
      createBidirectionalHook({
        relationshipField: 'relatedIndustries',
        targetCollection: 'industries',
        targetField: 'relatedProducts',
      }),
      createBidirectionalHook({
        relationshipField: 'relatedCaseStudies',
        targetCollection: 'case-studies',
        targetField: 'relatedProducts',
      }),
      createBidirectionalHook({
        relationshipField: 'relatedPosts',
        targetCollection: 'posts',
        targetField: 'relatedProducts',
      }),
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
