import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0d1117',
        'surface-alt': '#161b22',
        border: '#30363d',
        'text-muted': '#8b949e',
        'text-base': '#e6edf3',
        'accent-blue': '#58a6ff',
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
