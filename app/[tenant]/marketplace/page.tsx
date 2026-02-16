import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Layers, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { InterviewTemplateProduct } from "@/lib/interview/marketplaceTemplates";
import { getInterviewTemplateProducts } from "@/lib/interview/marketplaceTemplates";
import { TEMPLATE_REGISTRY } from "@/lib/interview/templateRegistry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Pilih template interview siap pakai untuk mempercepat proses seleksi dan onboarding peserta didik.",
};

const interviewProducts: InterviewTemplateProduct[] =
  getInterviewTemplateProducts();

const buildDashboardTemplateUrl = (templateId: string) =>
  `/dashboard/admissions?tab=interview&interviewView=forms&template=${templateId}`;

const featureHighlights = [
  {
    icon: Sparkles,
    title: "Kurasi Tim Akademik",
    description:
      "Setiap template diuji bersama guru dan pewawancara agar rubriknya relevan untuk PPDB dan monitoring siswa.",
  },
  {
    icon: ShieldCheck,
    title: "Siap Integrasi Dashboard",
    description:
      "Tersambung dengan builder interview di dashboard admissions. Import sekali klik, langsung dapat form dan struktur data.",
  },
  {
    icon: Layers,
    title: "Roadmap Marketplace",
    description:
      "Setelah template interview, kami siapkan kategori lain seperti survei, administrasi kegiatan, hingga tema WordPress headless.",
  },
];

type DetailProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

function renderHero() {
  return (
    <div className="bg-white">
      <section className="border-b bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <Badge variant="secondary" className="w-fit">
              Marketplace v1 • Fokus Interview
            </Badge>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Pilih produk digital untuk mempercepat proses seleksi dan branding institusi.
              </h1>
              <p className="text-base text-slate-600 sm:text-lg">
                Rilis pertama menghadirkan koleksi template interview siap pakai. Integrasi langsung ke dashboard
                admissions dan siap dikembangkan menjadi marketplace tema website.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="#interview-templates">
                  Lihat Koleksi Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Diskusikan Kebutuhan Lain</Link>
              </Button>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <div>
                <p className="text-2xl font-semibold text-slate-900">2+</p>
                <p>Template Interview Siap Pakai</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">6+</p>
                <p>Kategori Marketplace dalam Roadmap</p>
              </div>
            </div>
          </div>
          <Card className="flex-1 border-emerald-100 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-emerald-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">Why Marketplace</span>
              </div>
              <CardTitle className="text-2xl">
                Produk digital kurasi internal, siap ditingkatkan ke komunitas kreator.
              </CardTitle>
              <CardDescription>
                Setiap entri marketplace memiliki metadata, preview, dan pipeline import. Kami prioritaskan interview
                template lebih dulu sebelum membuka kategori tema front-end.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Single source of truth untuk semua template internal.</li>
                <li>Persiapan monetisasi partner/komunitas via kurasi.</li>
                <li>Integrasi pipeline apply template langsung ke dashboard.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {featureHighlights.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="space-y-4">
                <feature.icon className="h-10 w-10 rounded-full bg-slate-100 p-2 text-slate-700" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="interview-templates" className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Koleksi</Badge>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Interview Templates</p>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900">Template siap beli untuk PPDB dan monitoring siswa.</h2>
            <p className="max-w-3xl text-base text-slate-600">
              Semua template dibuat dengan struktur section, pertanyaan, dan opsi jawaban yang kompatibel dengan builder
              interview di dashboard admissions. Pembelian pertama akan mendapatkan assist onboarding.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {interviewProducts.map((product) => (
              <Card key={product.id} className="flex h-full flex-col">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <span className="text-xs font-medium uppercase text-emerald-600">
                      {product.status === "ready" ? "Ready" : "Coming Soon"}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{product.title}</CardTitle>
                    <CardDescription>{product.summary}</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-900">{product.level}</p>
                      <p>Segment</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{product.persona}</p>
                      <p>Tim pengguna</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {product.sections} / {product.questions}
                      </p>
                      <p>Section & Pertanyaan</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-4 grid gap-3">
                    {product.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-md border border-slate-100 bg-white/80 p-3 text-sm text-slate-700"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-dashed border-emerald-200 bg-white p-4 text-sm text-slate-600">
                    <p>
                      Sudah termasuk: struktur section, opsi jawaban, dan copywriting deskripsi. Kami bantu setup awal
                      langsung ke dashboard admissions Anda.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-left">
                    <p className="text-sm text-slate-500">Lisensi institusi</p>
                    <p className="text-2xl font-semibold text-slate-900">{product.price}</p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Button className="flex-1" asChild>
                      <Link href={buildDashboardTemplateUrl(product.id)}>
                        Gunakan di Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button className="flex-1" variant="outline" asChild>
                      <Link href="/contact">Hubungi Sales</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Roadmap</p>
              <h3 className="text-3xl font-semibold">Tema WordPress Headless & kategori template lainnya.</h3>
              <p className="text-base text-slate-200">
                Setelah katalog interview stabil, kami akan merilis marketplace tema website, survei layanan,
                administrasi kegiatan, hingga paket komunikasi digital. Ajak tim Anda untuk berpartisipasi sebagai
                kreator awal.
              </p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Daftar Sebagai Kreator</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TemplateDetail({ product }: { product: InterviewTemplateProduct }) {
  const registryItem = TEMPLATE_REGISTRY.find((item) => item.id === product.id);
  const sections = product.template.sections;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen pb-20">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              Template Detail
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>
              <p className="text-base text-slate-600">{product.summary}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="font-medium text-slate-900">{product.category}</span>
              <span>•</span>
              <span>{product.level}</span>
              <span>•</span>
              <span>{product.persona}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lisensi institusi</p>
              <p className="text-3xl font-semibold text-slate-900">{product.price}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" asChild>
                <Link href={buildDashboardTemplateUrl(product.id)}>
                  Gunakan di Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/contact">Diskusikan Paket</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Highlight Template</CardTitle>
            <CardDescription>Komponen inti yang membuat template ini unik.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {product.highlights.map((highlight) => (
              <div key={highlight} className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-700">
                {highlight}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Struktur Sections & Pertanyaan</CardTitle>
            <CardDescription>Preview setiap section beserta tipe pertanyaan yang tersedia.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={`${section.title}-${sectionIndex}`} className="rounded-lg border border-slate-100 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline">Bagian {sectionIndex + 1}</Badge>
                  <p className="font-semibold text-slate-900">{section.title}</p>
                </div>
                {section.description && (
                  <p className="text-sm text-slate-600 mb-3">{section.description}</p>
                )}
                <ul className="space-y-2">
                  {section.questions.map((question) => (
                    <li key={question.title} className="rounded border border-slate-100 bg-white p-2 text-sm">
                      <p className="font-medium text-slate-800">{question.title}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{question.type}</span>
                        {question.required && <span className="text-rose-500">Required</span>}
                      </div>
                      {question.description && (
                        <p className="text-xs text-muted-foreground mt-1">{question.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {registryItem?.marketplace && (
          <Card>
            <CardHeader>
              <CardTitle>Segmen Pengguna</CardTitle>
              <CardDescription>Rekomendasi implementasi template dalam operasional sekolah.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p><strong>Persona:</strong> {registryItem.marketplace.persona}</p>
              <p><strong>Tingkat:</strong> {registryItem.marketplace.level}</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

export default async function MarketplacePage({ searchParams }: DetailProps) {
  const resolvedSearchParams = await searchParams;
  const templateParam = resolvedSearchParams?.template;
  if (templateParam) {
    const product = interviewProducts.find((item) => item.id === templateParam);
    if (!product) {
      notFound();
    }
    return <TemplateDetail product={product} />;
  }
  return renderHero();
}

