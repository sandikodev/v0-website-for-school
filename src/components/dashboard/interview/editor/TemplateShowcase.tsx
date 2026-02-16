import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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

type TemplateShowcaseProps = {
  templates: InterviewTemplateProduct[];
  onSelectTemplate: (templateId: string) => void;
};

export function TemplateShowcase({ templates, onSelectTemplate }: TemplateShowcaseProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit">
          Etalase Template
        </Badge>
        <h2 className="text-2xl font-semibold text-slate-900">Marketplace Interview Templates</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Jelajahi paket pertanyaan yang sudah dikurasi tim akademik. Setiap template kompatibel dengan builder
          interview dan bisa dikustom setelah dimuat.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {templates.map((product) => (
          <Card key={product.id} className="flex h-full flex-col border-slate-200">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-xs font-medium uppercase text-emerald-600">
                  {product.status === "ready" ? "Ready" : "Coming Soon"}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">{product.title}</CardTitle>
                <CardDescription>{product.summary}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>{product.persona}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span>
                  {product.sections} sections · {product.questions} pertanyaan
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              {product.highlights.map((highlight) => (
                <div key={highlight} className="rounded-md border border-slate-100 bg-white/70 p-2">
                  {highlight}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Lisensi institusi</p>
                <p className="text-lg font-semibold text-slate-900">{product.price}</p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button className="flex-1" onClick={() => onSelectTemplate(product.id)}>
                  Gunakan Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button className="flex-1" variant="outline" asChild>
                  <Link href={`/marketplace?template=${product.id}`}>Detail</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

