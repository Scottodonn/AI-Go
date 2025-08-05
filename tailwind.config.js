/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff41',
        'neon-green-dark': '#00cc33',
        'neon-green-glow': '#00ff4140',
        'black': '#000000',
        'dark-gray': '#111111',
        'medium-gray': '#222222',
        'light-gray': '#333333',
        'text-green': '#00ff41',
        'text-green-dim': '#00cc33',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { 
            textShadow: '0 0 10px #00ff4140',
            boxShadow: '0 0 20px #00ff4140'
          },
          '50%': { 
            textShadow: '0 0 20px #00ff41',
            boxShadow: '0 0 30px #00ff41'
          },
        }
      }
    },
  },
  plugins: [],
} 