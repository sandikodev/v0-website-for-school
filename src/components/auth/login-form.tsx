"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, ArrowRight } from "lucide-react";

interface LoginFormProps {
    type: "platform" | "tenant";
    schoolName?: string;
    redirectTo?: string;
}

export function LoginForm({ type, schoolName }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email.trim(),
                    password: password.trim()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                const fallback = data.user.role === "admin" ? "/admin/overview" : "/tenant/overview";
                router.push(fallback);
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat login");
        } finally {
            setIsLoading(false);
        }
    };

    const isPlatform = type === "platform";

    return (
        <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                    {isPlatform ? "Email" : "Username"}
                </Label>
                <div className="relative">
                    {isPlatform ? (
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    ) : (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">👤</span>
                    )}
                    <Input
                        id="email"
                        type={isPlatform ? "email" : "text"}
                        placeholder={isPlatform ? "admin@sekolah.id" : "Masukkan username"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" name="password" className="text-sm font-medium">
                        Password
                    </Label>
                    {isPlatform && (
                        <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>
                <div className="relative">
                    {isPlatform ? (
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    ) : (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔒</span>
                    )}
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11"
                        required
                        disabled={isLoading}
                    />
                    {!isPlatform && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
            >
                {isLoading ? (
                    "Memproses..."
                ) : (
                    <>
                        Masuk
                        {isPlatform && <ArrowRight className="ml-2 w-4 h-4" />}
                    </>
                )}
            </Button>

            {isPlatform && (
                <>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500">Belum punya akun?</span>
                        </div>
                    </div>

                    <Link href="/signup">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 text-base font-medium border-2"
                        >
                            Daftar Sekolah Baru
                        </Button>
                    </Link>
                </>
            )}

            {!isPlatform && (
                <div className="mt-6 p-4 bg-primary-muted rounded-lg border border-primary/20">
                    <p className="text-sm text-primary text-center mb-3 font-medium">
                        Demo Credentials:
                    </p>
                    <div className="text-xs text-primary/80 space-y-1">
                        <div className="flex justify-between">
                            <span className="font-medium">Username:</span>
                            <span className="font-mono bg-white px-2 py-1 rounded">admin</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Password:</span>
                            <span className="font-mono bg-white px-2 py-1 rounded">admin123</span>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
