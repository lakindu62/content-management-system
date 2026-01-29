// src/access/roles.ts
import type { Access } from 'payload'

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('superAdmin'))
}

export const isAdminOrAbove: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.some((role) => ['superAdmin', 'admin'].includes(role)))
}

export const isEditor: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const canDeleteContent: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.some((role) => ['superAdmin', 'admin'].includes(role)))
}

export const canManageContent: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const canManageSite: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.some((role) => ['superAdmin', 'admin'].includes(role)))
}

export const canManageUsers: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('superAdmin'))
}
