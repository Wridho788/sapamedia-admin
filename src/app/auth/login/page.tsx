"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement Supabase authentication
      // For now, simulate login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful login
      if (
        formData.email === "admin@sapamedia.com" &&
        formData.password === "admin123"
      ) {
        router.push("/admin");
      } else {
        setError("Email atau password salah");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          Masuk ke Admin Panel
        </CardTitle>
        <CardDescription className="text-gray-600">
          Masukkan email dan password untuk mengakses dashboard
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
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@sapamedia.com"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Demo Credentials:
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Email: admin@sapamedia.com</div>
            <div>Password: admin123</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
