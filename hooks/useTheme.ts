"use client";

import { useEffect, useState } from "react";
import { ThemeManager } from "@/lib/design-tokens/theme-manager";
import type { ColorScheme } from "@/lib/design-tokens/themes";

const themeManager = new ThemeManager();

export function useTheme() {
  const [theme, setThemeState] = useState<ColorScheme>(
    themeManager.getTheme(),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    themeManager.init();

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent<{ theme: ColorScheme }>) => {
      setThemeState(event.detail.theme);
    };

    window.addEventListener(
      "theme-change",
      handleThemeChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "theme-change",
        handleThemeChange as EventListener,
      );
    };
  }, []);

  const setTheme = (newTheme: ColorScheme) => {
    themeManager.setTheme(newTheme);
    setThemeState(newTheme);
  };

  return {
    theme,
    setTheme,
    mounted,
    availableThemes: ThemeManager.getAvailableThemes(),
    themeColors: ThemeManager.getThemeColors(theme),
  };
}

