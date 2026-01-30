import type { GlobalConfig } from 'payload'

// Reusable field configurations
const phoneField = (label: string, description?: string) => ({
  name: 'phone',
  type: 'group' as const,
  label,
  fields: [
    {
      name: 'number',
      type: 'text' as const,
      label: 'Phone Number',
      required: true,
      admin: {
        description: description || 'Enter as displayed (e.g., 416.493.8888)',
      },
    },
    {
      name: 'extension',
      type: 'text' as const,
      label: 'Extension',
      required: false,
      admin: {
        description: 'Optional extension number',
      },
    },
  ],
})

const emailField = (label: string) => ({
  type: 'email' as const,
  label,
  required: true,
})

const urlField = (label: string) => ({
  type: 'text' as const,
  label,
  required: false,
  admin: {
    placeholder: `https://...`,
  },
})

const contactGroup = (name: string, label: string) => ({
  name,
  type: 'group' as const,
  label,
  fields: [
    {
      name: 'email',
      ...emailField(`${label} Email`),
    },
    phoneField(`${label} Phone Number`),
  ],
})

export const Company: GlobalConfig = {
  slug: 'company',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Information',
          fields: [
            phoneField('Main Phone Number'),
            {
              name: 'emailAddress',
              ...emailField('Main Email Address'),
            },
            {
              name: 'officeAddress',
              type: 'textarea',
              label: 'Office Address',
              required: true,
            },
            contactGroup('salesInquiry', 'Sales Inquiry'),
            contactGroup('shippingInquiry', 'Shipping Inquiry'),
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialMediaLinks',
              type: 'group',
              label: 'Social Media Links',
              fields: [
                {
                  name: 'facebook',
                  ...urlField('Facebook URL'),
                },
                {
                  name: 'linkedin',
                  ...urlField('LinkedIn URL'),
                },
                {
                  name: 'instagram',
                  ...urlField('Instagram URL'),
                },
                {
                  name: 'youtube',
                  ...urlField('YouTube URL'),
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              labels: {
                singular: 'Testimonial',
                plural: 'Testimonials',
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                  label: 'Testimonial Quote',
                  admin: {
                    description: 'The testimonial text from the client',
                  },
                },
                {
                  name: 'authorName',
                  type: 'text',
                  required: true,
                  label: 'Author Name',
                  admin: {
                    description: 'e.g., Andrew McKee',
                  },
                },
                {
                  name: 'authorTitle',
                  type: 'text',
                  required: true,
                  label: 'Author Title',
                  admin: {
                    description: 'e.g., CIO, Co-founder & CEO, D.CEO',
                  },
                },
                {
                  name: 'authorImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  label: 'Author Image',
                  admin: {
                    description: 'Optional: Author profile photo (circular image)',
                  },
                },
                {
                  name: 'companyLogo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  label: 'Company Logo',
                  admin: {
                    description: 'Optional: Company/Organization logo',
                  },
                },
              ],
              admin: {
                initCollapsed: true,
                useAsTitle: 'authorName',
              },
            },
          ],
        },
      ],
    },
  ],
}
