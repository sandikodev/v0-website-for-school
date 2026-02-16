"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          router.push("/dashboard");
        }
      } catch {
        // User not authenticated, stay on login page
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Username dan password harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect based on user role (from API response)
        const redirectUrl = data.redirectUrl || "/dashboard/tenant/overview";
        console.log("🔀 Redirecting to:", redirectUrl);
        
        // Check if redirectUrl is full URL or path
        if (redirectUrl.startsWith("http")) {
          // Full URL - use window.location for cross-domain redirect
          window.location.href = redirectUrl;
        } else {
          // Relative path - use router.push
          router.push(redirectUrl);
        }
      } else {
        setError(data.message || "Username atau password salah");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* School Logo/Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl shadow-lg">
          🏫
        </div>
        <h1 className="text-2xl font-bold text-primary">
          SMP IT Masjid Syuhada
        </h1>
        <p className="text-sm text-primary/80">Sistem Administrasi Sekolah</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto w-12 h-12 bg-primary-muted rounded-full flex items-center justify-center">
            <span className="text-xl">🔐</span>
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">
            Login Admin
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Masuk ke dashboard admin
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Username
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  👤
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 border-border focus:border-primary focus:ring-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  🔒
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-border focus:border-primary focus:ring-primary"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <span className="mr-2">⚠️</span>
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary-muted rounded-lg border border-primary/20">
            <p className="text-sm text-primary text-center mb-3 font-medium">
              Demo Credentials:
            </p>
            <div className="text-xs text-primary/80 space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Username:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">
                  admin
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Password:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">
                  admin123
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p>© 2024 SMP IT Masjid Syuhada Yogyakarta</p>
        <p>Mencetak Generasi Qurani</p>
      </div>
    </div>
  );
}
