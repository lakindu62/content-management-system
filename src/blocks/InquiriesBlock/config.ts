//used in the contact us page
import { Block } from 'payload'

export const InquiriesBlock: Block = {
  slug: 'inquiriesBlock',
  interfaceName: 'InquiriesBlock',
  fields: [
    {
      name: 'inquiriesTitle',
      type: 'text',
      label: 'Inquiries Title',
      required: true,
    },
  ],
}
