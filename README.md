# SapaMedia Admin Portal

Web admin portal untuk manajemen konten berita SapaMedia yang dibangun dengan Next.js 16, TypeScript, dan Tailwind CSS.

## ✨ Fitur Utama

### 🏠 Dashboard
- **Statistik Overview**: Total artikel, views, kategori, dan users
- **Status Artikel**: Tracking artikel berdasarkan status (Published, Draft, In Review, Archived)
- **Recent Articles**: Daftar artikel terbaru dengan informasi lengkap
- **Charts & Analytics**: Visualisasi data dengan recharts

### 📝 Article Management
- **Rich Text Editor**: Editor Tiptap dengan toolbar lengkap
- **Image Upload**: Upload gambar cover dan inline images
- **SEO Optimization**: Meta title, description, focus keyword, dan schema markup
- **Content Organization**: Sistem kategori dan tagging
- **Status Management**: 
  - ✅ Draft - Artikel masih dalam tahap penulisan
  - 🔍 In Review - Artikel menunggu review
  - 📰 Published - Artikel telah dipublikasikan  
  - 📦 Archived - Artikel diarsipkan

### 📁 Categories Management
- **CRUD Operations**: Create, Read, Update, Delete kategori
- **Visual Organization**: Color coding untuk setiap kategori
- **Article Count**: Tracking jumlah artikel per kategori
- **Slug Management**: Auto-generate slug dari nama kategori

### 👥 Users & Roles Management
- **Role-based Access**: Admin, Editor, Author
- **User Overview**: Profile, status, dan aktivitas user
- **Permission Management**: Kontrol akses berdasarkan peran
- **Activity Tracking**: Last login dan article count per user

### ⚙️ Settings
- **General Settings**: Site name, URL, timezone, language
- **Branding**: Logo upload, favicon, color scheme
- **SEO Configuration**: Default meta tags, Google Analytics
- **Social Media**: Links ke platform social media
- **Email Settings**: SMTP configuration
- **Content Settings**: Articles per page, comments moderation
- **Security**: Two-factor auth, session timeout

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **Rich Text Editor**: Tiptap
- **Form Management**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Image Upload**: Cloudinary (ready)
- **Database**: Supabase (ready)
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone repository**
   ```bash
   git clone [repository-url]
   cd sapamedia-admin
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Run development server**
   ```bash
   pnpm run dev
   ```

5. **Open application**
   ```
   http://localhost:3000
   ```

## 🚀 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   │   ├── articles/      # Article management
│   │   ├── categories/    # Category management  
│   │   ├── users/         # User management
│   │   └── settings/      # Settings page
│   └── auth/              # Authentication pages
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   ├── editor/           # Editor components
│   └── forms/            # Form components
├── lib/                  # Utilities
├── types/                # TypeScript definitions
├── hooks/                # Custom hooks
└── store/                # State management
```

### Available Scripts
```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
```

## 📋 Roadmap

### Phase 1 - Core Features ✅
- [x] Project setup dan konfigurasi
- [x] Layout dan navigation sidebar
- [x] Dashboard dengan statistics
- [x] Article management (CRUD + Editor)
- [x] Categories management
- [x] Users & Roles management
- [x] Settings page

### Phase 2 - Authentication & Database
- [ ] Supabase integration
- [ ] Authentication system (Login/Register)
- [ ] Database schema dan migrations
- [ ] Real data integration

### Phase 3 - Advanced Features
- [ ] Image upload ke Cloudinary
- [ ] Advanced SEO tools
- [ ] Email notifications
- [ ] Export/Import functionality
- [ ] Advanced analytics
- [ ] Comments moderation

### Phase 4 - Production Ready
- [ ] Performance optimization
- [ ] Error handling & logging
- [ ] Unit & integration tests
- [ ] Deployment automation
- [ ] Documentation lengkap

## 🎨 UI/UX Features

- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Dark/Light Mode**: Support untuk theme switching (planned)
- **Accessibility**: Keyboard navigation dan screen reader support
- **Loading States**: Skeleton dan spinner untuk better UX
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Feedback untuk user actions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

---

**SapaMedia Admin Portal** - Built with ❤️ for modern content management
