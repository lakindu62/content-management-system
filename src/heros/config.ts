import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { validateImagesOnPublish } from '@/collections/Hooks/ValidateImageSizeHook'
import { imageSizeOptions } from '@/collections/Hooks/ValidateImageSizeHook/utils'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Home Hero',
          value: 'homeHero',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Low Impact Type 02',
          value: 'lowImpactType02',
        },

        {
          label: 'Case Study Hero',
          value: 'caseStudyHero',
        },
      ],
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['lowImpact'].includes(type),
      },
      label: 'Tagline',
      maxLength: 50,
      required: true,

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate: (value: any) => {
        if (!value) return true
        const wordCount = value.trim().split(/\s+/).length
        if (wordCount > 6) {
          return `Tagline must be 6 words or less (currently ${wordCount} words)`
        }
        return true
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        condition: (_, { type } = {}) => ['homeHero', 'highImpact', 'mediumImpact'].includes(type),
      },
      label: false,
    },

    {
      name: 'top text',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        condition: (_, { type } = {}) => ['homeHero', 'highImpact', 'mediumImpact'].includes(type),
      },
      label: false,
    },

    {
      name: 'heroTitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => ['caseStudyHero', 'lowImpactType02'].includes(type),
      },
      label: 'Hero Title',
      required: true,
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => ['caseStudyHero', 'lowImpactType02'].includes(type),
      },
      label: 'Hero Description',
      required: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['caseStudyHero'].includes(type),
      },
      relationTo: 'media',
      label: 'Hero Image',
      required: true,
    },
    {
      name: 'statistics',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => ['caseStudyHero'].includes(type),
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Number/Value',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
      ],
      minRows: 1,
      maxRows: 6,
      label: 'Statistics',
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imagess',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
      validate: validateImagesOnPublish(imageSizeOptions.hero),
      fields: [
        {
          name: 'images',
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
      label: 'Hero Images',
      minRows: 1,
    },
  ],
  label: false,
}
