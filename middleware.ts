import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simplified middleware - let client-side guards handle auth
  // This prevents issues with localStorage/cookie sync
  
  // Just pass through all requests
  // Auth will be handled by:
  // 1. AuthProvider (app-level)
  // 2. RoleGuard (component-level)
  // 3. useAuth hooks (page-level)
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}