import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--surface-alt) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'text-base': 'rgb(var(--text-base) / <alpha-value>)',
        'accent-blue': 'rgb(var(--accent-blue) / <alpha-value>)',
        jupiter: '#d97706',
        saturn: '#a78bfa',
        uranus: '#67e8f9',
        neptune: '#34d399',
      },
    },
  },
  plugins: [],
};

export default config;
