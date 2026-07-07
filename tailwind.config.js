/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        weather: {
          light: {
            bg: '#F4F7FB',
            card: '#FFFFFF',
            text: '#1A1A2E',
            muted: '#6B7280',
          },
          dark: {
            bg: '#312B5B',
            card: 'rgba(255,255,255,0.15)',
            text: '#FFFFFF',
            muted: 'rgba(255,255,255,0.6)',
          },
          purple: '#48319D',
        },
      },
      borderRadius: {
        figma: {
          card: '30px',
          detail: '22px',
          screen: '44px',
        },
      },
    },
  },
  plugins: [],
}
