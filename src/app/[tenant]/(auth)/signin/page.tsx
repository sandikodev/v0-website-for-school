"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
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
          <LoginForm type="tenant" />
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
