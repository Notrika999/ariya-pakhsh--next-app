// src/lib/auth/route-permissions.ts

import { Permission, PERMISSIONS } from "../types/auth"



interface RoutePermission {
  path: string
  prefix?: boolean
  anyOf?: Permission[]
  allOf?: Permission[]
}

/**
 * super_admin اینجا چک نمیشه
 * چک super_admin توی permission utilities انجام میشه
 * اینجا فقط config هست
 */
export const routePermissions: RoutePermission[] = [
  // ── Products ─────────────────────────
  {
    path: '/management/products',
    prefix: true,
    anyOf: [
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE
    ]
  },

  // ── Orders ───────────────────────────
  {
    path: '/management/orders',
    prefix: true,
    anyOf: [PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_EDIT, PERMISSIONS.ORDERS_CANCEL, PERMISSIONS.ORDERS_REFUND]
  },

  // ── Users ────────────────────────────
  {
    path: '/management/users',
    prefix: true,
    anyOf: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.USERS_ASSIGN_ROLE
    ]
  },

  // ── Settings ─────────────────────────
  {
    path: '/management/settings',
    prefix: true,
    anyOf: [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_EDIT]
  },

  // ── Analytics ────────────────────────
  {
    path: '/management/analytics',
    prefix: true,
    anyOf: [PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.ANALYTICS_EXPORT]
  },

  // ── Dashboards (فقط auth لازمه) ─────
  {
    path: '/management/dashboards',
    prefix: true
  }
]

export function getRoutePermission(pathname: string): RoutePermission | undefined {
  const sorted = [...routePermissions].sort((a, b) => b.path.length - a.path.length)

  for (const route of sorted) {
    if (route.prefix) {
      if (pathname.startsWith(route.path)) return route
    } else {
      if (pathname === route.path) return route
    }
  }

  return undefined
}
