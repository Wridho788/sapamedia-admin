// Slug Generator Utility
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Status Badge Color Helper
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300',
    pending: 'bg-orange-100 text-orange-800 border-orange-300',
    approved: 'bg-blue-100 text-blue-800 border-blue-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    published: 'bg-green-100 text-green-800 border-green-300',
  }
  return colors[status] || colors.draft
}

// Status Label Helper
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending: 'Menunggu Review',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    published: 'Published',
  }
  return labels[status] || status
}

// Format Date Helper
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  
  if (diff < minute) {
    return 'Baru saja'
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes} menit lalu`
  } else if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours} jam lalu`
  } else if (diff < day * 7) {
    const days = Math.floor(diff / day)
    return `${days} hari lalu`
  } else {
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// Role Label Helper
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    editor: 'Editor',
    writer: 'Writer',
  }
  return labels[role] || role
}

// Validate Image File
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file harus JPG, PNG, WebP, atau GIF'
    }
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Ukuran file maksimal 2MB'
    }
  }
  
  return { valid: true }
}

// Debounce Helper
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Truncate Text
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
