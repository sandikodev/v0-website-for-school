/**
 * Theme Definitions
 * Color scheme definitions for different themes
 */

export type ColorScheme = "emerald" | "blue" | "purple" | "rose" | "amber" | "cyan";

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryForeground: string;
  primaryHover: string;
  primaryActive: string;
  primaryMuted: string;

  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  secondaryHover: string;
  secondaryActive: string;

  // Accent colors
  accent: string;
  accentForeground: string;
  accentHover: string;

  // Background colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // Muted colors
  muted: string;
  mutedForeground: string;

  // Border & Input
  border: string;
  input: string;
  ring: string;

  // Semantic colors
  destructive: string;
  destructiveForeground: string;
  success?: string;
  warning?: string;
  info?: string;

  // Button variants
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonPrimaryForeground: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  buttonGhostHover: string;
}

const emeraldTheme: ThemeColors = {
  primary: "oklch(0.45 0.15 160)",
  primaryForeground: "oklch(1 0 0)",
  primaryHover: "oklch(0.5 0.15 160)",
  primaryActive: "oklch(0.4 0.15 160)",
  primaryMuted: "oklch(0.95 0.03 160)",
  secondary: "oklch(0.55 0.15 160)",
  secondaryForeground: "oklch(1 0 0)",
  secondaryHover: "oklch(0.6 0.15 160)",
  secondaryActive: "oklch(0.5 0.15 160)",
  accent: "oklch(0.55 0.15 160)",
  accentForeground: "oklch(1 0 0)",
  accentHover: "oklch(0.6 0.15 160)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.25 0 0)",
  card: "oklch(0.98 0 0)",
  cardForeground: "oklch(0.25 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.25 0 0)",
  muted: "oklch(0.98 0 0)",
  mutedForeground: "oklch(0.45 0 0)",
  border: "oklch(0.92 0 0)",
  input: "oklch(1 0 0)",
  ring: "oklch(0.45 0.15 160 / 0.5)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(1 0 0)",
  success: "oklch(0.5 0.15 160)",
  warning: "oklch(0.7 0.15 85)",
  info: "oklch(0.55 0.15 220)",
  buttonPrimary: "oklch(0.45 0.15 160 / 0.9)",
  buttonPrimaryHover: "oklch(0.5 0.15 160)",
  buttonPrimaryForeground: "oklch(1 0 0)",
  buttonSecondary: "oklch(0.97 0 0)",
  buttonSecondaryHover: "oklch(0.95 0 0)",
  buttonGhostHover: "oklch(0.97 0 0 / 0.8)",
};

const blueTheme: ThemeColors = {
  primary: "oklch(0.45 0.15 240)",
  primaryForeground: "oklch(1 0 0)",
  primaryHover: "oklch(0.5 0.15 240)",
  primaryActive: "oklch(0.4 0.15 240)",
  primaryMuted: "oklch(0.95 0.03 240)",
  secondary: "oklch(0.55 0.15 240)",
  secondaryForeground: "oklch(1 0 0)",
  secondaryHover: "oklch(0.6 0.15 240)",
  secondaryActive: "oklch(0.5 0.15 240)",
  accent: "oklch(0.55 0.15 240)",
  accentForeground: "oklch(1 0 0)",
  accentHover: "oklch(0.6 0.15 240)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.25 0 0)",
  card: "oklch(0.98 0 0)",
  cardForeground: "oklch(0.25 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.25 0 0)",
  muted: "oklch(0.98 0 0)",
  mutedForeground: "oklch(0.45 0 0)",
  border: "oklch(0.92 0 0)",
  input: "oklch(1 0 0)",
  ring: "oklch(0.45 0.15 240 / 0.5)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(1 0 0)",
  success: "oklch(0.5 0.15 160)",
  warning: "oklch(0.7 0.15 85)",
  info: "oklch(0.55 0.15 240)",
  buttonPrimary: "oklch(0.45 0.15 240 / 0.9)",
  buttonPrimaryHover: "oklch(0.5 0.15 240)",
  buttonPrimaryForeground: "oklch(1 0 0)",
  buttonSecondary: "oklch(0.97 0 0)",
  buttonSecondaryHover: "oklch(0.95 0 0)",
  buttonGhostHover: "oklch(0.97 0 0 / 0.8)",
};

const purpleTheme: ThemeColors = {
  primary: "oklch(0.45 0.15 280)",
  primaryForeground: "oklch(1 0 0)",
  primaryHover: "oklch(0.5 0.15 280)",
  primaryActive: "oklch(0.4 0.15 280)",
  primaryMuted: "oklch(0.95 0.03 280)",
  secondary: "oklch(0.55 0.15 280)",
  secondaryForeground: "oklch(1 0 0)",
  secondaryHover: "oklch(0.6 0.15 280)",
  secondaryActive: "oklch(0.5 0.15 280)",
  accent: "oklch(0.55 0.15 280)",
  accentForeground: "oklch(1 0 0)",
  accentHover: "oklch(0.6 0.15 280)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.25 0 0)",
  card: "oklch(0.98 0 0)",
  cardForeground: "oklch(0.25 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.25 0 0)",
  muted: "oklch(0.98 0 0)",
  mutedForeground: "oklch(0.45 0 0)",
  border: "oklch(0.92 0 0)",
  input: "oklch(1 0 0)",
  ring: "oklch(0.45 0.15 280 / 0.5)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(1 0 0)",
  success: "oklch(0.5 0.15 160)",
  warning: "oklch(0.7 0.15 85)",
  info: "oklch(0.55 0.15 220)",
  buttonPrimary: "oklch(0.45 0.15 280 / 0.9)",
  buttonPrimaryHover: "oklch(0.5 0.15 280)",
  buttonPrimaryForeground: "oklch(1 0 0)",
  buttonSecondary: "oklch(0.97 0 0)",
  buttonSecondaryHover: "oklch(0.95 0 0)",
  buttonGhostHover: "oklch(0.97 0 0 / 0.8)",
};

const roseTheme: ThemeColors = {
  primary: "oklch(0.45 0.15 15)",
  primaryForeground: "oklch(1 0 0)",
  primaryHover: "oklch(0.5 0.15 15)",
  primaryActive: "oklch(0.4 0.15 15)",
  primaryMuted: "oklch(0.95 0.03 15)",
  secondary: "oklch(0.55 0.15 15)",
  secondaryForeground: "oklch(1 0 0)",
  secondaryHover: "oklch(0.6 0.15 15)",
  secondaryActive: "oklch(0.5 0.15 15)",
  accent: "oklch(0.55 0.15 15)",
  accentForeground: "oklch(1 0 0)",
  accentHover: "oklch(0.6 0.15 15)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.25 0 0)",
  card: "oklch(0.98 0 0)",
  cardForeground: "oklch(0.25 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.25 0 0)",
  muted: "oklch(0.98 0 0)",
  mutedForeground: "oklch(0.45 0 0)",
  border: "oklch(0.92 0 0)",
  input: "oklch(1 0 0)",
  ring: "oklch(0.45 0.15 15 / 0.5)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(1 0 0)",
  success: "oklch(0.5 0.15 160)",
  warning: "oklch(0.7 0.15 85)",
  info: "oklch(0.55 0.15 220)",
  buttonPrimary: "oklch(0.45 0.15 15 / 0.9)",
  buttonPrimaryHover: "oklch(0.5 0.15 15)",
  buttonPrimaryForeground: "oklch(1 0 0)",
  buttonSecondary: "oklch(0.97 0 0)",
  buttonSecondaryHover: "oklch(0.95 0 0)",
  buttonGhostHover: "oklch(0.97 0 0 / 0.8)",
};

const amberTheme: ThemeColors = {
  primary: "oklch(0.6 0.15 85)",
  primaryForeground: "oklch(0.1 0 0)",
  primaryHover: "oklch(0.65 0.15 85)",
  primaryActive: "oklch(0.55 0.15 85)",
  primaryMuted: "oklch(0.97 0.03 85)",
  secondary: "oklch(0.7 0.15 85)",
  secondaryForeground: "oklch(0.1 0 0)",
  secondaryHover: "oklch(0.75 0.15 85)",
  secondaryActive: "oklch(0.65 0.15 85)",
  accent: "oklch(0.7 0.15 85)",
  accentForeground: "oklch(0.1 0 0)",
  accentHover: "oklch(0.75 0.15 85)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.25 0 0)",
  card: "oklch(0.98 0 0)",
  cardForeground: "oklch(0.25 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.25 0 0)",
  muted: "oklch(0.98 0 0)",
  mutedForeground: "oklch(0.45 0 0)",
  border: "oklch(0.92 0 0)",
  input: "oklch(1 0 0)",
  ring: "oklch(0.6 0.15 85 / 0.5)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(1 0 0)",
  success: "oklch(0.5 0.15 160)",
  warning: "oklch(0.7 0.15 85)",
  info: "oklch(0.55 0.15 220)",
  buttonPrimary: "oklch(0.6 0.15 85 / 0.9)",
  buttonPrimaryHover: "oklch(0.65 0.15 85)",
  buttonPrimaryForeground: "oklch(0.1 0 0)",
  buttonSecondary: "oklch(0.97 0 0)",
  buttonSecondaryHover: "oklch(0.95 0 0)",
  buttonGhostHover: "oklch(0.97 0 0 / 0.8)",
};

const cyanTheme: ThemeColors = {
  primary: "oklch(0.45 0.15 200)",
  primaryForeground: "oklch(1 0 0)",
  primaryHover: "oklch(0.5 0.15 200)",
  primaryActive: "oklch(0.4 0.15 200)",
  primaryMuted: "oklch(0.95 0.03 200)",
  secondary: "oklch(0.55 0.15 200)",
  secondaryForeground: "oklch(1 0 0)",
  secondaryHover: "oklch(0.6 0.15 200)",
  secondaryActive: "oklch(0.5 0.15 200)",
  accent: "oklch(0.55 0.15 200)",
  accentForeground: "oklch(1 0 0)",
  accentHover: "oklch(0.6 0.15 200)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.25 0 0)",
  card: "oklch(0.98 0 0)",
  cardForeground: "oklch(0.25 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.25 0 0)",
  muted: "oklch(0.98 0 0)",
  mutedForeground: "oklch(0.45 0 0)",
  border: "oklch(0.92 0 0)",
  input: "oklch(1 0 0)",
  ring: "oklch(0.45 0.15 200 / 0.5)",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(1 0 0)",
  success: "oklch(0.5 0.15 160)",
  warning: "oklch(0.7 0.15 85)",
  info: "oklch(0.55 0.15 200)",
  buttonPrimary: "oklch(0.45 0.15 200 / 0.9)",
  buttonPrimaryHover: "oklch(0.5 0.15 200)",
  buttonPrimaryForeground: "oklch(1 0 0)",
  buttonSecondary: "oklch(0.97 0 0)",
  buttonSecondaryHover: "oklch(0.95 0 0)",
  buttonGhostHover: "oklch(0.97 0 0 / 0.8)",
};

export const themes: Record<ColorScheme, ThemeColors> = {
  emerald: emeraldTheme,
  blue: blueTheme,
  purple: purpleTheme,
  rose: roseTheme,
  amber: amberTheme,
  cyan: cyanTheme,
};

export const defaultTheme: ColorScheme = "emerald";

