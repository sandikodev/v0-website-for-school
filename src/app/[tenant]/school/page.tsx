import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Newspaper,
  FileText,
  User,
  Building2,
  GraduationCap,
  Users,
  Blocks,
} from "lucide-react";

export default function SchoolHubPage() {
  const items = [
    { href: "/profile", title: "Profil", icon: User },
    { href: "/academic", title: "Akademik", icon: GraduationCap },
    { href: "/staff", title: "Staff & Pengajar", icon: Users },
    { href: "/facilities", title: "Fasilitas", icon: Building2 },
    { href: "/admissions", title: "SPMB", icon: FileText },
  ];

  const news = [
    { id: 1, title: "PPDB 2025 Dibuka!", date: "27 Sep 2025" },
    { id: 2, title: "Juara 1 Lomba Sains Kabupaten", date: "20 Sep 2025" },
    { id: 3, title: "Renovasi Perpustakaan Selesai", date: "12 Sep 2025" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 pb-20 md:pb-6">
      {/* Status pengguna */}
      <Card className="mb-4">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="text-base font-semibold">Tamu</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Tidak Masuk</Badge>
            <Link href="/signin">
              <Button size="sm">Masuk</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Aksi cepat: ikon scrollable untuk mobile */}
      <section aria-label="Aksi cepat" className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-balance">Aksi Cepat</h2>
          <Blocks
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="group">
                <Card className="w-28 sm:w-32 transition-colors group-hover:bg-accent">
                  <CardContent className="py-4 flex flex-col items-center justify-center gap-2">
                    <it.icon
                      className="h-6 w-6 text-muted-foreground group-hover:text-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-center text-xs sm:text-sm">
                      {it.title}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Berita terkini */}
      <section aria-label="Berita terkini" className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-balance">Berita Terkini</h2>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Informasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <ul className="divide-y">
              {news.map((n) => (
                <li key={n.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-pretty">
                      <Link
                        href="/#berita"
                        className="font-medium hover:underline"
                      >
                        {n.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {n.date}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/#berita">Baca</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />
            <div className="flex justify-end">
              <Button variant="ghost" asChild>
                <Link href="/#berita">Lihat semua</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
