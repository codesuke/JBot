'use client';

/**
 * DESIGN SYSTEM COLOR TOKENS
 * Based on public/design-system documentation
 * 
 * Dark Theme & Light Theme support
 * Using OKLch color space for perceptual uniformity
 */

// Dark Theme Colors (OKLCH)
export const darkTheme = {
  // Primary
  primary: 'oklch(0.7162 0.1597 290.3962)',        // Purple
  primaryForeground: 'oklch(0.1743 0.0227 283.7998)', // Dark blue-black

  // Secondary
  secondary: 'oklch(0.3139 0.0736 283.4591)',       // Dark purple
  secondaryForeground: 'oklch(0.8367 0.0849 285.9111)', // Light purple

  // Accent
  accent: 'oklch(0.3354 0.0828 280.9705)',         // Accent purple
  accentForeground: 'oklch(0.9185 0.0257 285.8834)', // Light text

  // Background & Surface
  background: 'oklch(0.1743 0.0227 283.7998)',     // Dark background
  foreground: 'oklch(0.9185 0.0257 285.8834)',     // Light foreground
  card: 'oklch(0.2284 0.0384 282.9324)',           // Card background
  cardForeground: 'oklch(0.9185 0.0257 285.8834)', // Card text

  // Utility
  muted: 'oklch(0.2710 0.0621 281.4377)',          // Gray-blue
  mutedForeground: 'oklch(0.7166 0.0462 285.1741)', // Muted text
  destructive: 'oklch(0.6861 0.2061 14.9941)',     // Red
  border: 'oklch(0.3261 0.0597 282.5832)',         // Border color
};

// Light Theme Colors (OKLCH)
export const lightTheme = {
  // Primary
  primary: 'oklch(0.5417 0.1790 288.0332)',        // Purple
  primaryForeground: 'oklch(1.0000 0 0)',          // White

  // Secondary
  secondary: 'oklch(0.9174 0.0435 292.6901)',      // Light purple
  secondaryForeground: 'oklch(0.4143 0.1039 288.1742)', // Dark purple

  // Accent
  accent: 'oklch(0.9221 0.0373 262.1410)',         // Light accent
  accentForeground: 'oklch(0.3015 0.0572 282.4176)', // Dark text

  // Background & Surface
  background: 'oklch(0.9730 0.0133 286.1503)',     // Light background
  foreground: 'oklch(0.3015 0.0572 282.4176)',     // Dark foreground
  card: 'oklch(1.0000 0 0)',                       // White
  cardForeground: 'oklch(0.3015 0.0572 282.4176)', // Dark text

  // Utility
  muted: 'oklch(0.9580 0.0133 286.1454)',          // Light gray
  mutedForeground: 'oklch(0.5426 0.0465 284.7435)', // Gray text
  destructive: 'oklch(0.6861 0.2061 14.9941)',     // Red
  border: 'oklch(0.9115 0.0216 285.9625)',         // Light border
};

// Shadow System
export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
};

// Typography
export const typography = {
  fontSans: ['Geist', 'system-ui', 'sans-serif'],
  fontMono: ['Geist Mono', 'monospace'],
  fontSerif: ['Source Serif 4', 'serif'],
};

// Border Radius
export const radius = {
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px (base)
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  full: '9999px',    // Fully rounded
};

/**
 * USAGE IN COMPONENTS
 * 
 * Tailwind automatically maps CSS variables to these values
 * Check your tailwind.config.ts for the mapping
 * 
 * Examples:
 * - bg-background     → Background color
 * - text-foreground   → Text color
 * - border-border     → Border color
 * - bg-primary        → Primary button background
 * - text-primary-foreground → Primary button text
 * 
 * Dark mode is controlled via:
 * 1. HTML <html class="dark"> attribute
 * 2. CSS media query prefers-color-scheme
 * 3. Tailwind dark: prefix classes
 */

export default {
  darkTheme,
  lightTheme,
  shadows,
  typography,
  radius,
} as const;
