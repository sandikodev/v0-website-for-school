"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/useTheme";
import { ThemeManager } from "@/lib/design-tokens/theme-manager";
import type { ColorScheme } from "@/lib/design-tokens/themes";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/dashboard/settings/DarkModeToggle";

const themeLabels: Record<ColorScheme, string> = {
  emerald: "Emerald (Hijau)",
  blue: "Blue (Biru)",
  purple: "Purple (Ungu)",
  rose: "Rose (Merah Muda)",
  amber: "Amber (Kuning Emas)",
  cyan: "Cyan (Biru Terang)",
};

const themeDescriptions: Record<ColorScheme, string> = {
  emerald: "Tema hijau yang segar dan menenangkan",
  blue: "Tema biru yang profesional dan terpercaya",
  purple: "Tema ungu yang kreatif dan modern",
  rose: "Tema merah muda yang hangat dan ramah",
  amber: "Tema kuning emas yang energik dan optimis",
  cyan: "Tema biru terang yang cerah dan dinamis",
};

export function ThemeSelector() {
  const { theme, setTheme, mounted, availableThemes } = useTheme();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tema & Warna
              </CardTitle>
              <CardDescription>
                Pilih tema warna sesuai preferensi Anda. Perubahan akan langsung
                diterapkan.
              </CardDescription>
            </div>
            <DarkModeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tema Saat Ini: {themeLabels[theme]}</Label>
            </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableThemes.map((themeOption) => {
              const isSelected = theme === themeOption;
              const themeColors = ThemeManager.getThemeColors(themeOption);

              return (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={cn(
                    "relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
                  )}
                  aria-label={`Pilih tema ${themeLabels[themeOption]}`}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 w-full">
                    {/* Color Preview */}
                    <div
                      className="h-10 w-10 rounded-full border-2 border-border shadow-sm"
                      style={{
                        backgroundColor: themeColors.primary,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {themeLabels[themeOption]}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {themeDescriptions[themeOption]}
                      </p>
                    </div>
                  </div>
                  {/* Color Palette Preview */}
                  <div className="flex gap-1.5 w-full mt-2">
                    <div
                      className="h-4 flex-1 rounded"
                      style={{
                        backgroundColor: themeColors.primary,
                      }}
                    />
                    <div
                      className="h-4 flex-1 rounded"
                      style={{
                        backgroundColor: themeColors.secondary,
                      }}
                    />
                    <div
                      className="h-4 flex-1 rounded"
                      style={{
                        backgroundColor: themeColors.accent,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

