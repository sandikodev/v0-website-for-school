"use client";

/**
 * Theme Manager
 * Manages theme switching and persistence
 */

import { themes, type ColorScheme, defaultTheme } from "./themes";

const THEME_STORAGE_KEY = "app-theme";
const THEME_ATTRIBUTE = "data-theme";

export class ThemeManager {
  private currentTheme: ColorScheme;

  constructor() {
    // Get theme from localStorage or use default
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      this.currentTheme = (stored as ColorScheme) || defaultTheme;
    } else {
      this.currentTheme = defaultTheme;
    }
  }

  /**
   * Get current theme
   */
  getTheme(): ColorScheme {
    return this.currentTheme;
  }

  /**
   * Set theme and apply CSS variables
   */
  setTheme(theme: ColorScheme): void {
    if (typeof window === "undefined") return;

    this.currentTheme = theme;
    const colors = themes[theme];

    // Apply CSS variables to :root
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, theme);

    // Set CSS variables
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--primary-hover", colors.primaryHover);
    root.style.setProperty("--primary-active", colors.primaryActive);
    root.style.setProperty("--primary-muted", colors.primaryMuted);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--secondary-hover", colors.secondaryHover);
    root.style.setProperty("--secondary-active", colors.secondaryActive);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--accent-hover", colors.accentHover);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--popover", colors.popover);
    root.style.setProperty("--popover-foreground", colors.popoverForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.input);
    root.style.setProperty("--ring", colors.ring);
    root.style.setProperty("--destructive", colors.destructive);
    root.style.setProperty(
      "--destructive-foreground",
      colors.destructiveForeground,
    );

    // Button variants
    root.style.setProperty("--button-primary", colors.buttonPrimary);
    root.style.setProperty("--button-primary-hover", colors.buttonPrimaryHover);
    root.style.setProperty(
      "--button-primary-foreground",
      colors.buttonPrimaryForeground,
    );
    root.style.setProperty("--button-secondary", colors.buttonSecondary);
    root.style.setProperty(
      "--button-secondary-hover",
      colors.buttonSecondaryHover,
    );
    root.style.setProperty("--button-ghost-hover", colors.buttonGhostHover);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Dispatch custom event for theme change
    window.dispatchEvent(
      new CustomEvent("theme-change", { detail: { theme } }),
    );
  }

  /**
   * Initialize theme on mount
   */
  init(): void {
    if (typeof window === "undefined") return;
    this.setTheme(this.currentTheme);
  }

  /**
   * Get all available themes
   */
  static getAvailableThemes(): ColorScheme[] {
    return Object.keys(themes) as ColorScheme[];
  }

  /**
   * Get theme colors
   */
  static getThemeColors(theme: ColorScheme) {
    return themes[theme];
  }
}

