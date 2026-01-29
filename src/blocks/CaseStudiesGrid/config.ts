import { Block } from 'payload'

export const CaseStudiesGrid: Block = {
  slug: 'caseStudiesGrid',
  interfaceName: 'CaseStudiesGridBlock',
  fields: [
    {
      name: 'featuredCaseStudy',
      type: 'relationship',
      relationTo: 'case-studies',
      admin: {
        description: 'This will be the first to be displayed in the grid',
      },
    },
  ],
}
