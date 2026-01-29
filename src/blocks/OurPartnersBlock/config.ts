import { Block } from 'payload'

export const OurPartnersBlock: Block = {
  slug: 'ourPartnersBlock',
  interfaceName: 'OurPartnersBlock',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Our Partners',
    },
    {
      name: 'displayType',
      type: 'select',
      label: 'Display Type',
      required: true,
      defaultValue: 'withoutDescription',
      options: [
        {
          label: 'Without Description',
          value: 'withoutDescription',
        },
        {
          label: 'With Description',
          value: 'withDescription',
        },
      ],
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        condition: (data, siblingData, { user }) => {
          // Use siblingData instead of data for block fields
          return siblingData?.displayType === 'withDescription'
        },
      },
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
}
