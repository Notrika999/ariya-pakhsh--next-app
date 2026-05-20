// src/lib/auth/permissions.ts


import { Permission, Role } from '../types/auth'
import { SUPER_ADMIN_ROLE } from './constants'

/**
 * super_admin همیشه true برمیگردونه
 * بقیه بر اساس permissions چک میشن
 */

export function isSuperAdmin(roles: Role[]): boolean {
  return roles.includes(SUPER_ADMIN_ROLE)
}

export function hasPermission(roles: Role[], userPermissions: Permission[], required: Permission): boolean {
  if (isSuperAdmin(roles)) return true
  return userPermissions.includes(required)
}

export function hasAllPermissions(roles: Role[], userPermissions: Permission[], required: Permission[]): boolean {
  if (isSuperAdmin(roles)) return true
  return required.every(p => userPermissions.includes(p))
}

export function hasAnyPermission(roles: Role[], userPermissions: Permission[], required: Permission[]): boolean {
  if (isSuperAdmin(roles)) return true
  return required.some(p => userPermissions.includes(p))
}

export function hasRole(userRoles: Role[], required: Role): boolean {
  if (isSuperAdmin(userRoles)) return true
  return userRoles.includes(required)
}

export function hasAnyRole(userRoles: Role[], required: Role[]): boolean {
  if (isSuperAdmin(userRoles)) return true
  return required.some(role => userRoles.includes(role))
}
