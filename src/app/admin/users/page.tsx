'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@sapamedia.com',
    role: 'admin',
    avatar: null,
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T09:00:00Z',
    articleCount: 15
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@sapamedia.com',
    role: 'editor',
    avatar: null,
    status: 'active',
    lastLogin: '2024-01-14T16:20:00Z',
    createdAt: '2024-01-05T14:30:00Z',
    articleCount: 23
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@sapamedia.com',
    role: 'author',
    avatar: null,
    status: 'active',
    lastLogin: '2024-01-13T11:45:00Z',
    createdAt: '2024-01-10T11:15:00Z',
    articleCount: 8
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@sapamedia.com',
    role: 'author',
    avatar: null,
    status: 'inactive',
    lastLogin: '2024-01-05T08:20:00Z',
    createdAt: '2024-01-08T16:45:00Z',
    articleCount: 12
  }
]

const roles = [
  { value: 'admin', label: 'Administrator', color: 'bg-red-100 text-red-700' },
  { value: 'editor', label: 'Editor', color: 'bg-blue-100 text-blue-700' },
  { value: 'author', label: 'Author', color: 'bg-green-100 text-green-700' }
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[2]
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their permissions.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const roleInfo = getRoleInfo(user.role)
          return (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${roleInfo.color}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {roleInfo.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Articles:</span>
                      <span className="font-medium">{user.articleCount}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Last login: {new Date(user.lastLogin).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by inviting your first team member.'
              }
            </p>
            {!searchQuery && roleFilter === 'all' && statusFilter === 'all' && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}