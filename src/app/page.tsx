import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center space-y-8 text-center px-4">
        {/* Logo */}
        <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
          <Image
            src="/Logo.png"
            alt="SapaMedia Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">SapaMedia</h1>
          <p className="text-xl text-gray-600 max-w-md">
            Admin Portal untuk Manajemen Konten Berita
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/admin"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Masuk ke Admin Panel
          </Link>
          <Link 
            href="/auth/login"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
        </div>

       
      </main>
    </div>
  );
}
