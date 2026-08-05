import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Motion.dev-inspired color palette (dark theme). Hyphenated keys match
      // how these are actually referenced across components (`bg-background-light`,
      // `text-muted-foreground`) — the old underscored keys silently produced no
      // utility at all, which is why cards/dimmed text were invisible sitewide.
      colors: {
        background: 'hsl(var(--background))',
        'background-light': 'hsl(var(--background-light))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--foreground-muted))',
          foreground: 'hsl(var(--foreground-muted))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
      },

      // Motion.design inspired typography
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },

      // Motion-inspired typography scale
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      // Sharp corners, everywhere, no exceptions. Every `rounded-*` utility —
      // including `rounded-full` — resolves to 0 so a stray class in any
      // component can never reintroduce a radius. This is the enforcement
      // point for the Swiss direction; don't relax it per-component.
      borderRadius: {
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
        DEFAULT: '0px',
      },

      // Likewise: no drop-shadows. The style communicates depth with hairline
      // rules and whitespace, so `shadow-*` utilities collapse to nothing.
      boxShadow: {
        none: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
        DEFAULT: 'none',
      },

      // Motion-inspired easing
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shuffle: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(50px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shuffle: 'shuffle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;