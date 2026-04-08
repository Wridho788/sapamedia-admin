'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/types'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  ImageIcon
} from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: any
  roles: UserRole[]
  children?: { title: string; href: string; roles: UserRole[] }[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['admin', 'editor', 'writer']
  },
  {
    title: 'Articles',
    href: '/admin/articles',
    icon: FileText,
    roles: ['admin', 'editor', 'writer'],
    children: [
      { title: 'All Articles', href: '/admin/articles', roles: ['admin', 'editor', 'writer'] },
      { title: 'New Article', href: '/admin/articles/new', roles: ['admin', 'writer'] }
    ]
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
    roles: ['admin', 'editor']
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: ImageIcon,
    roles: ['admin', 'editor']
  },
  {
    title: 'Users & Roles',
    href: '/admin/users',
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin']
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { authUser } = useAuthStore()

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const handleLogout = async () => {
    // Simple logout for testing
    router.push('/auth/login')
  }

  // Filter menu items based on user role - show all items for testing
  const filteredMenuItems = menuItems

  return (
    <div className={cn('pb-12 w-64 bg-white border-r border-gray-200', className)}>
      <div className="space-y-4 py-4">
        {/* Logo */}
        <div className="px-6 py-2">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/Logo.png"
                alt="SapaMedia Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg text-gray-900">SapaMedia</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {authUser?.role?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {authUser?.role === 'super_admin' ? 'Super Admin' : authUser?.role?.replace('_', ' ') || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {authUser?.role === 'super_admin' ? 'Admin' : authUser?.role || 'No Role'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const isExpanded = expandedItems.includes(item.href)
              const hasChildren = item.children && item.children.length > 0
              
              // Show all children for testing
              const filteredChildren = item.children

              return (
                <div key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors flex-1',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </Link>
                    {hasChildren && filteredChildren && filteredChildren.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isExpanded && 'transform rotate-90'
                          )}
                        />
                      </button>
                    )}
                  </div>
                  
                  {hasChildren && isExpanded && filteredChildren && (
                    <div className="ml-6 mt-1 space-y-1">
                      {filteredChildren.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                            pathname === child.href
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pt-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
