/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        brand: 'hsl(var(--brand) / <alpha-value>)',
        'brand-fg': 'hsl(var(--brand-fg) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'fade-in': { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'none' } },
        flow: { '0%': { transform: 'translateY(0)', opacity: 0 }, '15%': { opacity: 1 }, '85%': { opacity: 1 }, '100%': { transform: 'translateY(46px)', opacity: 0 } },
        back: { '0%': { transform: 'translate(0,0)', opacity: 0 }, '20%': { opacity: 1 }, '100%': { transform: 'translate(-40px,-36px)', opacity: 0 } },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        flow: 'flow 2.4s ease-in infinite',
        back: 'back 2.4s ease-in infinite',
      },
    },
  },
  plugins: [],
};
