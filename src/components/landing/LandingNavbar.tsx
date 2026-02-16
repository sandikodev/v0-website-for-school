"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 pointer-events-auto border border-white/20",
                    isScrolled
                        ? "bg-slate-900/80 backdrop-blur-2xl py-3 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        : "bg-white/10 backdrop-blur-md py-4 px-10"
                )}
            >
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-indigo-500/20">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-2xl font-black tracking-tighter leading-none transition-colors duration-300",
                                isScrolled ? "text-white" : "text-slate-900"
                            )}>
                                AKSESEKOLAH
                            </span>
                            <span className={cn(
                                "text-[10px] uppercase tracking-[0.2em] font-bold opacity-60",
                                isScrolled ? "text-indigo-400" : "text-indigo-600"
                            )}>
                                Premium Platform
                            </span>
                        </div>
                    </Link>

                    {/* Dock-style Nav */}
                    <div className="hidden md:flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/5">
                        <div className="flex items-center space-x-1">
                            <NavLink href="#features" isScrolled={isScrolled}>Fitur</NavLink>
                            <NavLink href="#pricing" isScrolled={isScrolled}>Harga</NavLink>
                            <NavLink href="#about" isScrolled={isScrolled}>Testimoni</NavLink>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/signin"
                            className={cn(
                                "text-sm font-bold transition-colors px-6 py-2 rounded-full",
                                isScrolled ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                            )}
                        >
                            Sign In
                        </Link>
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full px-8 shadow-xl shadow-indigo-600/20 group transition-all hover:scale-105 active:scale-95">
                            <Link href="/signup">
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={cn(
                            "md:hidden p-2 rounded-xl transition-colors",
                            isScrolled ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-black/5"
                        )}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu - Custom Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-24 left-6 right-6 p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 pointer-events-auto md:hidden"
                >
                    <div className="flex flex-col space-y-6">
                        <MobileNavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>Fitur Unggulan</MobileNavLink>
                        <MobileNavLink href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Paket Harga</MobileNavLink>
                        <MobileNavLink href="#about" onClick={() => setIsMobileMenuOpen(false)}>Testimoni User</MobileNavLink>
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex flex-col space-y-4">
                            <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/20 text-white hover:bg-white/5">
                                <Link href="/signin">Sign In</Link>
                            </Button>
                            <Button asChild className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold">
                                <Link href="/signup">Mulai Gratis</Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function NavLink({ href, isScrolled, children }: { href: string; isScrolled: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 relative group",
                isScrolled
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-black/5"
            )}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-2xl font-black text-white hover:text-indigo-400 transition-colors"
        >
            {children}
        </Link>
    );
}
