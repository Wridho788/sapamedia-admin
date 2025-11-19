import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-20 h-20 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow mx-auto mb-4">
              <Image
                src="/Logo.png"
                alt="SapaMedia Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">SapaMedia</h1>
        </div>

        {/* Auth Form */}
        {children}
      </div>
    </div>
  );
}
