'use client'

import React from 'react'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/types'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { authUser } = useAuthStore()

  if (!authUser) {
    return fallback || (
      <div className="p-4 text-center text-gray-500">
        <p>You need to be logged in to access this feature.</p>
      </div>
    )
  }

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const hasAccess = allowedRoles.includes(authUser.role)

  if (!hasAccess) {
    return fallback || (
      <div className="p-4 text-center text-gray-500">
        <p>You don't have permission to access this feature.</p>
      </div>
    )
  }

  return <>{children}</>
}
