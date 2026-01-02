'use client'

import { usePermissions, useAuth } from '@/hooks/use-auth'
import { WriterDashboard } from '@/components/dashboard/writer-dashboard'
import { EditorDashboard } from '@/components/dashboard/editor-dashboard'
import { SuperAdminDashboard } from '@/components/dashboard/superadmin-dashboard'

export default function AdminDashboard() {
  const { hasRole } = usePermissions()
  const { authUser } = useAuth()

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Role-based dashboard rendering - Sprint 1 requirement
  if (hasRole('writer')) {
    return <WriterDashboard userId={authUser.id} />
  }

  if (hasRole('editor')) {
    return <EditorDashboard />
  }

  if (hasRole('super_admin')) {
    return <SuperAdminDashboard />
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-500">Invalid role</p>
      </div>
    </div>
  )
}
