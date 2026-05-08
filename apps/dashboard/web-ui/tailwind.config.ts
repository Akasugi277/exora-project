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
        jupiter: 'rgb(var(--color-jupiter) / <alpha-value>)',
        saturn:  'rgb(var(--color-saturn)  / <alpha-value>)',
        uranus:  'rgb(var(--color-uranus)  / <alpha-value>)',
        neptune: 'rgb(var(--color-neptune) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;
