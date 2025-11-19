'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploader } from '@/components/ui/image-uploader'
import { 
  Save,
  Globe,
  Image,
  Palette,
  Database,
  Shield,
  Mail,
  Smartphone
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SapaMedia',
    siteDescription: 'Portal Berita dan Informasi Terpercaya',
    siteUrl: 'https://sapamedia.com',
    adminEmail: 'admin@sapamedia.com',
    timezone: 'Asia/Jakarta',
    language: 'id',
    
    // Branding
    siteLogo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    
    // SEO
    defaultMetaTitle: 'SapaMedia - Portal Berita Terpercaya',
    defaultMetaDescription: 'Dapatkan berita terbaru dan informasi terpercaya dari SapaMedia',
    googleAnalyticsId: '',
    googleSearchConsole: '',
    
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    
    // Email
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    
    // Content
    articlesPerPage: '10',
    allowComments: true,
    moderateComments: true,
    
    // Security
    enableTwoFactor: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5'
  })

  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Here you would save settings to your database
      console.log('Saving settings:', settings)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'social', label: 'Social Media', icon: Smartphone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'content', label: 'Content', icon: Image },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your site settings and preferences.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name *
                    </label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      placeholder="Your site name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL *
                    </label>
                    <Input
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                      placeholder="https://yoursite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    placeholder="Brief description of your site"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email *
                    </label>
                    <Input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                      placeholder="admin@yoursite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <Select value={settings.timezone} onValueChange={(value: any) => setSettings({...settings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                        <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                        <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'branding' && (
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Logo
                    </label>
                    <ImageUploader
                      value={settings.siteLogo}
                      onChange={(url) => setSettings({...settings, siteLogo: url})}
                      onRemove={() => setSettings({...settings, siteLogo: ''})}
                      label="Upload Logo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon
                    </label>
                    <ImageUploader
                      value={settings.favicon}
                      onChange={(url) => setSettings({...settings, favicon: url})}
                      onRemove={() => setSettings({...settings, favicon: ''})}
                      label="Upload Favicon"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-10 h-10 rounded border border-gray-300"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-10 h-10 rounded border border-gray-300"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meta Title
                  </label>
                  <Input
                    value={settings.defaultMetaTitle}
                    onChange={(e) => setSettings({...settings, defaultMetaTitle: e.target.value})}
                    placeholder="Your site's default meta title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meta Description
                  </label>
                  <Textarea
                    value={settings.defaultMetaDescription}
                    onChange={(e) => setSettings({...settings, defaultMetaDescription: e.target.value})}
                    placeholder="Your site's default meta description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <Input
                      value={settings.googleAnalyticsId}
                      onChange={(e) => setSettings({...settings, googleAnalyticsId: e.target.value})}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Search Console
                    </label>
                    <Input
                      value={settings.googleSearchConsole}
                      onChange={(e) => setSettings({...settings, googleSearchConsole: e.target.value})}
                      placeholder="Verification code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add more tab contents as needed */}
        </div>
      </div>
    </div>
  )
}