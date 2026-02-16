"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Users,
  Layout,
  Zap,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  BarChart3,
  Instagram,
  Twitter,
  Linkedin,
  Rocket
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { cn } from "@/lib/utils";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function PlatformHomePage() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const yShift = useTransform(scrollYProgress, [0, 0.5], [0, 150]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <LandingNavbar />

      {/* Hero Section - Super Premium Center Aligned */}
      <section className="relative pt-48 pb-20 overflow-hidden flex flex-col items-center">
        {/* Deep Field Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_50%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.05),transparent_50%)]" />

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -40, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] -right-[15%] w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[100px]"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="max-w-5xl mx-auto text-center space-y-12"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.95] md:leading-[0.9]"
              >
                Masa Depan <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Edukasi Indonesia
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Platform super-app untuk sekolah. Kelola <span className="text-slate-900 font-bold underline decoration-indigo-500/30 underline-offset-4">PPDB</span>,
                administrasi, dan kehadiran dalam satu ekosistem yang intuitif.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-full border border-indigo-100 mx-auto"
              >
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.15em] uppercase">Versi 2.0 Kini Tersedia</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button asChild size="lg" className="h-16 px-12 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black rounded-3xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] group transition-all hover:-translate-y-1 active:scale-95">
                <Link href="/signup">
                  Mulai Digitalisasi
                  <Rocket className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-16 px-12 text-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 font-bold rounded-3xl transition-all border border-slate-200">
                <Link href="#features">Pelajari Fitur</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image / Portal - Fixed Clipping & Overflow Issues */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 relative max-w-5xl mx-auto px-4"
          >
            <div className="relative aspect-[16/10] w-full group">
              {/* Outer Image Container with rounded corners but NO overflow-hidden to allow widgets to pop */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-slate-200 bg-white/50 shadow-2xl shadow-indigo-500/5">
                <Image
                  src="/images/landing-hero.png"
                  alt="Dashboard Preview"
                  fill
                  className="object-contain p-4 md:p-8 transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              {/* Floating Widget Elements - Now positioned outside the rounded clipping path */}
              <div className="absolute top-1/4 -left-8 md:-left-12 p-6 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 hidden lg:block hover:rotate-3 transition-transform cursor-default z-30">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl leading-none">2,410</h4>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">Siswa Terdaftar</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 -right-8 md:-right-12 p-6 bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 hidden lg:block hover:-rotate-3 transition-transform cursor-default z-30">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="text-white">
                    <h4 className="font-black text-xl leading-none italic">98.5%</h4>
                    <p className="text-[10px] uppercase font-black text-indigo-300 tracking-widest mt-1">Efisiensi Admin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Reflection Under Hero */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-20 bg-indigo-500/10 blur-[80px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Proof Grid - Center Aligned Minimalist */}
      <section className="pb-20 -mt-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-y border-slate-100 py-10">
            <h5 className="text-sm font-black text-slate-300 max-w-[12rem] leading-tight flex-shrink-0 uppercase italic tracking-tighter">
              Solusi Terpercaya Untuk Sekolah Anda
            </h5>
            <div className="flex flex-wrap flex-1 justify-center md:justify-end items-center gap-x-12 gap-y-8 opacity-30 grayscale saturate-0 hover:grayscale-0 hover:saturate-100 transition-all duration-700">
              <span className="text-xl font-black tracking-tighter">SMA BIMA JOGJA</span>
              <span className="text-xl font-black tracking-tighter">SD MUHAMMADIYAH</span>
              <span className="text-xl font-black tracking-tighter">SMP IT SYUHADA</span>
              <span className="text-xl font-black tracking-tighter">AL-AZHAR PUSAT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section - High-End Bento Grid */}
      <section id="features" className="py-32 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10 opacity-60" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-50 rounded-full blur-[100px] -z-10 opacity-60" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
            <div className="max-w-3xl space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 bg-indigo-600/5 border border-indigo-600/10 px-4 py-2 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">The Ultimate Toolkit</span>
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                Sempurnakan Setiap Lini <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                  Operasional Sekolah.
                </span>
              </h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-slate-400 max-w-md font-bold leading-tight pb-4"
            >
              Kami mengeliminasi kerumitan administrasi, memberikan Anda waktu lebih untuk <span className="text-slate-900 underline decoration-indigo-500/30 decoration-4 underline-offset-8">Mendidik Generasi.</span>
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 lg:gap-8 h-auto lg:h-[800px]">
            {/* Main Featured Card */}
            <div className="md:col-span-12 lg:col-span-7 row-span-1 lg:row-span-2">
              <FeatureCard
                icon={<Rocket className="w-10 h-10" />}
                title="Pendaftaran Digital PPDB"
                description="Ubah proses manual yang melelahkan menjadi sistem pendaftaran 24/7 yang otomatis. Lengkap dengan verifikasi data dan manajemen status pendaftaran yang sangat intuitif."
                color="indigo"
                isMain
              />
            </div>

            <div className="md:col-span-6 lg:col-span-5 row-span-1">
              <FeatureCard
                icon={<Layout className="w-7 h-7" />}
                title="Custom Branding Domain"
                description="Gunakan nama sekolah Anda (sekolahanda.sch.id) untuk meningkatkan kredibilitas di mata wali murid."
                color="purple"
              />
            </div>

            <div className="md:col-span-6 lg:col-span-5 row-span-1">
              <FeatureCard
                icon={<Zap className="w-7 h-7" />}
                title="WhatsApp Auto-Sync"
                description="Sinkronisasi otomatis notifikasi pembayaran dan jadwal wawancara langsung ke WhatsApp orang tua."
                color="pink"
              />
            </div>
          </div>

          {/* Secondary Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Cloud Security"
              description="Enkripsi data standar militer untuk melindungi keamanan privasi siswa."
              color="green"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Visualisasi data statistik pendaftaran yang akurat untuk pengambilan keputusan."
              color="amber"
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="Support 24/7"
              description="Pendampingan teknis penuh dari tim ahli kami kapanpun Anda membutuhkan."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Minimalist */}
      <section id="pricing" className="py-32 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24 space-y-4">
            <span className="text-indigo-600 font-black uppercase text-xs tracking-widest">Pricing Strategy</span>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">Investasi Masa Depan <br />Digital Sekolah.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PricingCard
              name="Starter"
              price="Gratis"
              description="Untuk sekolah baru mandiri"
              features={[
                "Subdomain gratis",
                "Maksimal 100 Siswa",
                "Form Builder Dasar",
                "Support via Email",
                "Keamanan Dasar"
              ]}
              cta="Coba Gratis"
            />
            <PricingCard
              name="Professional"
              price="Rp 500k"
              period="/bulan"
              description="Pilihan paling favorit"
              features={[
                "Custom Domain Sendiri",
                "Siswa Tanpa Batas",
                "Notifikasi WhatsApp Pro",
                "Advanced Analytics",
                "Priority Support 24/7",
                "SSL Certificate Pro"
              ]}
              highlighted
              cta="Pilih Pro"
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="Solusi yayasan & group"
              features={[
                "Multi-Sekolah Portal",
                "Custom Development",
                "Integrasi API & Webhook",
                "Training On-Site",
                "Account Manager Khusus",
                "SLA Uptime 99.9%"
              ]}
              cta="Hubungi Kami"
            />
          </div>
        </div>
      </section>

      {/* Callout Section - Modern Dark Card */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95]">Siap Menuju Digital?</h2>
                <p className="text-indigo-200 text-xl font-medium max-w-xl opacity-80 leading-relaxed">
                  Bergabunglah dengan ratusan sekolah yang sudah meningkatkan efisiensi administrasi mereka sebesar 70% menggunakan platform AkseSekolah.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <Button asChild size="lg" className="h-14 px-10 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1">
                    <Link href="/signup">Daftar Sekarang</Link>
                  </Button>
                  <div className="flex items-center space-x-4 px-6 py-3 border border-indigo-500/30 rounded-2xl bg-indigo-500/5 backdrop-blur-sm">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                          <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="user" width={40} height={40} />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-white/60 tracking-widest uppercase">Verified Schools</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-md bg-indigo-600 rounded-[2.5rem] p-4 shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700 aspect-square flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <Image src="/images/landing-hero.png" alt="app" fill className="object-cover opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Asymmetric Layout */}
      <section id="about" className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24 space-y-4">
            <span className="text-indigo-600 font-black uppercase text-xs tracking-widest">Voice of the People</span>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">Kisah Kesuksesan <br />Sekolah di AkseSekolah.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Dulu kami menghabiskan mingguan untuk memilah data calon siswa. Sekarang? Hanya tekan satu tombol dan laporannya sudah jadi."
              author="Ahmad Fauzi, M.Pd"
              role="Kepala Sekolah SMP IT"
              avatar="AF"
            />
            <TestimonialCard
              quote="Antarmukanya sangat cantik dan ceria. Orang tua murid merasa bangga saat mengisi formulir pendaftaran di website kami."
              author="Siti Aminah"
              role="Tim Admisi Sekolah"
              avatar="SA"
            />
            <TestimonialCard
              quote="Layanan dukungannya sangat responsif. Kami senang menjadi bagian dari perjalanan digital AkseSekolah."
              author="Wira Atmaja"
              role="Ketua Yayasan"
              avatar="WA"
            />
          </div>
        </div>
      </section>

      {/* Footer - Super Premium Handcrafted Footer */}
      <footer className="footer bg-white pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-5 space-y-12">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-all shadow-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter leading-none">AKSESEKOLAH</span>
                  <span className="text-[10px] uppercase tracking-[.25em] font-bold text-indigo-600">Premium Education Platform</span>
                </div>
              </Link>
              <h4 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.95] tracking-tight">
                Membangun Ekosistem Digital Pendidikan Yang Lebih Baik.
              </h4>
              <div className="flex items-center space-x-6">
                <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" />
                <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
                <SocialLink icon={<Linkedin className="w-5 h-5" />} href="#" />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 pt-8">
              <div className="space-y-8">
                <h6 className="text-[10px] uppercase font-black tracking-widest text-slate-300">Solutions</h6>
                <ul className="space-y-4 font-bold text-slate-500">
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">PPDB Online</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Admin Portal</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Cloud Backup</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">WhatsApp Pro</Link></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h6 className="text-[10px] uppercase font-black tracking-widest text-slate-300">Company</h6>
                <ul className="space-y-4 font-bold text-slate-500">
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Our Story</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Blog Post</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Press Kit</Link></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h6 className="text-[10px] uppercase font-black tracking-widest text-slate-300">Support</h6>
                <ul className="space-y-4 font-bold text-slate-500">
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Security</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Status 24/7</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <p>&copy; 2025 PT KONEKSI JARINGAN INDONESIA. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-12">
              <span className="flex items-center"><Globe className="w-3 h-3 mr-2 text-indigo-500" /> INDONESIA</span>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
    >
      {icon}
    </Link>
  );
}

function TestimonialCard({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col space-y-10 group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
    >
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Sparkles key={i} className="w-6 h-6 text-amber-300 fill-amber-300 opacity-40 group-hover:opacity-100 transition-opacity" />
        ))}
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-tight italic">
        <span className="text-indigo-500 text-4xl font-serif">"</span>
        {quote}
      </p>
      <div className="flex items-center space-x-5 pt-4">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/20 rotate-3 group-hover:rotate-12 transition-all">
          {avatar}
        </div>
        <div>
          <h5 className="font-black text-slate-900 leading-none mb-1 text-lg">{author}</h5>
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  isMain = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isMain?: boolean;
}) {
  const colorMap: any = {
    indigo: "from-indigo-500 to-indigo-700 text-indigo-500 shadow-indigo-500/20",
    purple: "from-purple-500 to-purple-700 text-purple-500 shadow-purple-500/20",
    pink: "from-pink-500 to-pink-700 text-pink-500 shadow-pink-500/20",
    green: "from-green-500 to-green-700 text-green-500 shadow-green-500/20",
    amber: "from-amber-500 to-amber-700 text-amber-500 shadow-amber-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12, scale: 1.01 }}
      className={cn(
        "h-full p-10 rounded-[3rem] transition-all duration-500 group relative overflow-hidden flex flex-col border",
        isMain
          ? "bg-slate-900 border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]"
          : "bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10"
      )}
    >
      {/* Background Glow for Main Card */}
      {isMain && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -z-0 pointer-events-none" />
      )}

      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 shadow-lg group-hover:scale-110 group-hover:rotate-3",
        isMain ? "bg-white/10 text-white backdrop-blur-md" : "bg-slate-50",
        !isMain && colorMap[color].split(" ").slice(2).join(" ") // Extract text color
      )}>
        <div className={cn(isMain ? "text-white" : colorMap[color].split(" ")[2])}>
          {icon}
        </div>
      </div>

      <div className="space-y-6 flex-1 relative z-10">
        <h4 className={cn(
          "font-black tracking-tight leading-none",
          isMain ? "text-4xl md:text-5xl text-white" : "text-3xl text-slate-900"
        )}>
          {title}
        </h4>
        <p className={cn(
          "font-bold leading-relaxed",
          isMain ? "text-indigo-100 opacity-60 text-lg md:text-xl" : "text-slate-400 opacity-80"
        )}>
          {description}
        </p>
      </div>

      {isMain && (
        <div className="pt-10 relative z-10 flex flex-col h-full">
          <div className="flex-1 min-h-[200px] relative mb-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {/* Abstract UI Mockup inside card */}
            <div className="absolute inset-0 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-2 w-24 bg-white/20 rounded-full" />
                <div className="h-6 w-16 bg-indigo-500/30 rounded-full border border-indigo-500/50" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-1/2 bg-white/30 rounded-full" />
                      <div className="h-1 w-1/4 bg-white/10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
          </div>

          <div className="flex items-center space-x-2 text-indigo-400 font-black text-xs uppercase tracking-widest mt-auto">
            <span>Explore Module</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      )}

      {/* Decorative Element */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-transform duration-700 group-hover:scale-150",
        isMain ? "bg-indigo-500" : "bg-indigo-100"
      )} />
    </motion.div>
  );
}


function PricingCard({
  name,
  price,
  period = "",
  description,
  features,
  highlighted = false,
  cta
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "p-10 rounded-[3rem] border-2 flex flex-col relative overflow-hidden transition-all duration-500",
        highlighted
          ? "bg-slate-900 text-white border-indigo-600 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] z-10"
          : "bg-white text-slate-900 border-slate-100 hover:border-indigo-200"
      )}
    >
      <div className="mb-10">
        <h4 className={cn("text-sm font-black uppercase tracking-widest mb-2", highlighted ? "text-indigo-400" : "text-indigo-600")}>{name}</h4>
        <p className={cn("text-xs font-bold", highlighted ? "text-slate-400" : "text-slate-400")}>{description}</p>
      </div>

      <div className="flex items-baseline mb-10">
        <span className="text-6xl font-black tracking-tighter">{price}</span>
        <span className="text-sm font-black opacity-40 ml-2 uppercase tracking-tighter">{period}</span>
      </div>

      <ul className="space-y-5 mb-12 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center text-sm font-bold opacity-80">
            <CheckCircle2 className={cn("w-5 h-5 mr-4 flex-shrink-0", highlighted ? "text-indigo-400" : "text-indigo-600")} />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={cn(
          "w-full h-14 rounded-2xl text-base font-black transition-all shadow-xl",
          highlighted
            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
            : "bg-slate-900 hover:bg-black text-white"
        )}
      >
        <Link href="/signup">{cta}</Link>
      </Button>
    </motion.div>
  );
}

