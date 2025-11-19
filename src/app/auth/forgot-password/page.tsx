"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement Supabase password reset
      // For now, simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim email reset");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Email Terkirim!</CardTitle>
          <CardDescription className="text-gray-600">
            Kami telah mengirim link reset password ke email Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Cek inbox email <strong>{email}</strong> dan ikuti instruksi untuk mereset password Anda.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Kembali ke Login
              </Link>
            </Button>
            
            <button
              onClick={() => setSuccess(false)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Kirim ulang email
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
        <CardDescription className="text-gray-600">
          Masukkan email Anda untuk mendapatkan link reset password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="h-11"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11" 
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Kembali ke Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
