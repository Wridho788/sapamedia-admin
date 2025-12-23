import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">🔒</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Feature Not Available
          </h2>
          <p className="mt-2 text-gray-600">
            This feature is not available for your current role.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/admin">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}