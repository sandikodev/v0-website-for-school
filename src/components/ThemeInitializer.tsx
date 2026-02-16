"use client";

import { useEffect } from "react";
import { ThemeManager } from "@/lib/design-tokens/theme-manager";

const themeManager = new ThemeManager();

export function ThemeInitializer() {
  useEffect(() => {
    themeManager.init();
  }, []);

  return null;
}

