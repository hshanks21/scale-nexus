import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wired': {
          'ink': 'var(--color-wired-ink)',
          'canvas': 'var(--color-wired-canvas)',
          'canvas-soft': 'var(--color-wired-canvas-soft)',
          'hairline': 'var(--color-wired-hairline)',
          'body': 'var(--color-wired-body)',
          'link': 'var(--color-wired-link)',
        },
        'origin': {
          'canvas': 'var(--color-origin-canvas)',
          'surface': 'var(--color-origin-surface)',
          'border': 'var(--color-origin-border)',
          'ink': 'var(--color-origin-ink)',
          'body': 'var(--color-origin-body)',
          'accent': 'var(--color-origin-accent)',
          'selected': 'var(--color-origin-selected)',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'lora': ['Lora', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
