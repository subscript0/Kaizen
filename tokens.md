# Motion Design Tokens (Extracted from motion.dev)

## Colors
- Background: hsl(0 0% 5%) /* #0d1111 */
- Background-light: hsl(0 0% 8%)
- Surface: hsl(0 0% 8%) /* For cards/panels */
- Foreground: hsl(210 20% 98%) /* #ededec */
- Foreground-muted: hsl(210 15% 75%)
- Primary/Accent: hsl(195 91% 53%) /* Cyan-ish */
- Border: hsl(210 15% 18%)
- Ring: hsl(195 91% 53%) /* Focus ring */
- Destructive: hsl(0 72% 51%) /* Red for errors */

## Typography
- Font Sans: Manrope (variable: --font-sans)
- Font Serif: Playfair Display (variable: --font-serif)
- Font Mono: DM Mono (variable: --font-mono)
- Base font size: 1rem (16px)
- Line heights:
  - xs: 1rem
  - sm: 1.25rem
  - base: 1.5rem
  - lg: 1.75rem
  - xl: 1.75rem
  - 2xl: 2rem
  - 3xl: 2.25rem
  - 4xl: 2.5rem
  - 5xl: 1
  - 6xl: 1
  - 7xl: 1
  - 8xl: 1
  - 9xl: 1

## Spacing (4px base unit)
- 0: 0px
- px: 1px
- 0.5: 0.125rem
- 1: 0.25rem
- 1.5: 0.375rem
- 2: 0.5rem
- 2.5: 0.625rem
- 3: 0.75rem
- 3.5: 0.875rem
- 4: 1rem
- 5: 1.25rem
- 6: 1.5rem
- 7: 1.75rem
- 8: 2rem
- 9: 2.25rem
- 10: 2.5rem
- 11: 2.75rem
- 12: 3rem
- 14: 3.5rem
- 16: 4rem
- 20: 5rem
- 24: 6rem
- 28: 7rem
- 32: 8rem
- 36: 9rem
- 40: 10rem
- 44: 11rem
- 48: 12rem
- 52: 13rem
- 56: 14rem
- 60: 15rem
- 64: 16rem
- 72: 18rem
- 80: 20rem
- 96: 24rem

## Border Radius
- none: 0px
- sm: 0.125rem (2px)
- DEFAULT: 0.25rem (4px)
- md: 0.375rem (6px)
- lg: 0.5rem (8px)
- xl: 0.75rem (12px)
- 2xl: 1rem (16px)
- 3xl: 1.5rem (24px)
- full: 9999px

## Motion/Easing
### Durations
- Short: 150ms
- Base: 200ms
- Medium: 400ms
- Long: 500ms

### Easing Functions (cubic-bezier)
- Snap (quick response): cubic-bezier(0.4, 0, 0.2, 1)
- UI (smooth reveal): cubic-bezier(0.25, 0.1, 0.25, 1.0)
- Gentle (soft entrance): cubic-bezier(0.3, 0, 0.7, 1)
- Lively (bouncy): cubic-bezier(0.68, -0.55, 0.265, 1.55)
- Ambient (subtle float): cubic-bezier(0.4, 0, 0.6, 1)