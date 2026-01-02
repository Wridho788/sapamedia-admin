// Status Badge Component - Sprint 2
import { getStatusColor, getStatusLabel } from '@/lib/helpers'
import { PostStatus } from '@/types'

interface StatusBadgeProps {
  status: PostStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${getStatusColor(status)}
        ${className}
      `}
    >
      {getStatusLabel(status)}
    </span>
  )
}
