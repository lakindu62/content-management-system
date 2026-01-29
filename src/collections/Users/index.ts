import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isSuperAdmin } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdmin,
    update: isSuperAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      // Show in admin UI
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
