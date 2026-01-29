import { Block } from 'payload'

export const StatisticsBlock: Block = {
  slug: 'statisticsBlock',
  interfaceName: 'StatisticsBlock',
  fields: [
    {
      name: 'statistics',
      type: 'array',
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
      required: true,
    },
  ],
}
