'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Articles',
    href: '/admin/articles',
    icon: FileText,
    children: [
      { title: 'All Articles', href: '/admin/articles' },
      { title: 'New Article', href: '/admin/articles/new' },
      { title: 'Drafts', href: '/admin/articles/drafts' }
    ]
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen
  },
  {
    title: 'Users & Roles',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

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

        {/* Navigation */}
        <div className="px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const isExpanded = expandedItems.includes(item.href)
              const hasChildren = item.children && item.children.length > 0

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
                    {hasChildren && (
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
                  
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children?.map((child) => (
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
          <button className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}