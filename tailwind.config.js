/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './scripts/**/*.{ts,js}',
    './data/**/*.json',
    './README.md'
  ],
  theme: {
    extend: {
      colors: {
        night: '#0b1120'
      },
      boxShadow: {
        glow: '0 0 120px rgba(14,165,233,0.25)'
      }
    }
  },
  safelist: [
    {
      pattern:
        /(from|via|to)-(amber|rose|fuchsia|cyan|blue|indigo|emerald|lime|purple|slate)-(100|200|300|400|500|600)/
    },
    {
      pattern: /(text)-(amber|cyan|emerald|purple)-(200|300)/
    }
  ],
  plugins: []
};

