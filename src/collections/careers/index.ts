import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import type { CollectionConfig } from 'payload'
import { canDeleteContent } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const Careers: CollectionConfig = {
  slug: 'careers',
  defaultPopulate: {
    title: true,
    slug: true,
    department: true,
    location: true,
    position: true,
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
        description: 'Job title (e.g., Senior Software Engineer)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the job title',
      },
    },
    {
      name: 'department',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Department (e.g., Engineering, Marketing, Sales)',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Job location (e.g., Remote, New York, London)',
      },
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Position type (e.g., Full-time, Part-time, Contract)',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    UnorderedListFeature(), // Adds bullet points
                    OrderedListFeature(),
                  ]
                },
              }),
              admin: {
                description: 'Full job description, responsibilities, requirements, etc.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
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
