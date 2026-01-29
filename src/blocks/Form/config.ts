import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },

    {
      name: 'formType',
      type: 'select',
      defaultValue: 'requestAQuote',
      options: [
        { label: 'Contact Us Page', value: 'contactUsPage' },
        { label: 'Request a Quote', value: 'requestAQuote' },
      ],
      admin: {
        condition: (data, siblingData) => {
          return siblingData?.form === '6973ac11114c56cbbbad4e9e'
        },
      },
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
