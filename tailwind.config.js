/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: '#111726',
          cardHover: '#161e33',
          border: '#1f2942',
          borderHover: '#334168',
          accent: '#6366f1',
          accentGlow: '#818cf8',
          neonCyan: '#06b6d4',
          neonGreen: '#10b981',
          neonPurple: '#a855f7',
          neonPink: '#ec4899',
          neonAmber: '#f59e0b',
          muted: '#64748b',
          text: '#f8fafc',
          subtext: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.35)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { opacity: 0.4 },
          '100%': { opacity: 0.9 },
        }
      }
    },
  },
  plugins: [],
}
