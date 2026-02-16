"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles, FilePlus } from "lucide-react";

interface TemplateDescriptor {
  id: string;
  label: string;
}

interface FormTemplatesBarProps {
  templates: TemplateDescriptor[];
  onLoadTemplate: (templateId: string) => void;
  onCreateNew: () => void;
}

const QUICK_ACTION_LIMIT = 2;

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  "seleksi-diniyah":
    "Memuat template form untuk seleksi kemampuan Al-Qur'an, tahfidz, dan aktivitas ibadah.",
  "seleksi-kesiswaan":
    "Memuat template form untuk wawancara kesiswaan (konsep diri, sosial, akademik, prestasi).",
  "observasi-karakter":
    "Form observasi karakter harian: kedisiplinan, interaksi sosial, sikap spiritual.",
  "kunjungan-rumah":
    "Template home visit untuk evaluasi lingkungan, fasilitas belajar, dan dukungan orang tua.",
};

export function FormTemplatesBar({
  templates,
  onLoadTemplate,
  onCreateNew,
}: FormTemplatesBarProps) {
  const quickActions = templates.slice(0, QUICK_ACTION_LIMIT);
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
        {quickActions.map((template) => {
          const description = TEMPLATE_DESCRIPTIONS[template.id] || `Memuat template ${template.label}`;
          const ariaLabel = `Muat template ${template.label}`;

          return (
            <Tooltip key={template.id}>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLoadTemplate(template.id)}
                  className="min-h-0 min-w-0 w-8 md:w-auto h-8 px-2 md:px-3"
                  aria-label={ariaLabel}
                  title={ariaLabel}
                >
                  <Sparkles className="h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" aria-hidden="true" />
                  <span className="hidden md:inline">{template.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                align="start"
                sideOffset={6}
                className="max-w-xs"
              >
                <p className="font-medium mb-1">{template.label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={onCreateNew}
              className="min-w-0 w-8 md:w-auto min-h-0 h-8 px-2 md:px-3"
              aria-label="Buat form interview kosong"
              title="Buat form interview kosong"
            >
              <FilePlus className="h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" aria-hidden="true" />
              <span className="hidden md:inline">Form Kosong</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            align="start"
            sideOffset={6}
            className="max-w-xs"
          >
            <p className="font-medium mb-1">Form Kosong</p>
            <p className="text-xs text-muted-foreground">
              Membuat form interview baru tanpa template. Anda dapat menambahkan bagian dan pertanyaan sesuai kebutuhan.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

