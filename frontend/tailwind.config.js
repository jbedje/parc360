/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Côte d'Ivoire PME Brand Colors
        cipme: {
          orange: '#ED6D11',      // Primary brand color
          'orange-light': '#FF8533',
          'orange-dark': '#D45D00',
          charcoal: '#32373c',    // Dark backgrounds
          'charcoal-light': '#4a5158',
          gray: '#30353a',        // Footer/secondary backgrounds
          'gray-light': '#abb8c3',
          ivory: {
            DEFAULT: '#F7931E',   // Côte d'Ivoire flag orange
            light: '#FFB366',
            dark: '#E67E00',
          },
          green: {
            DEFAULT: '#009E60',   // Côte d'Ivoire flag green
            light: '#00C878',
            dark: '#007A4D',
          },
        },
        // Keep compatibility with existing code
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ED6D11',  // Main CI-PME orange
          600: '#D45D00',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cipme': '0 4px 6px -1px rgba(237, 109, 17, 0.1), 0 2px 4px -1px rgba(237, 109, 17, 0.06)',
        'cipme-lg': '0 10px 15px -3px rgba(237, 109, 17, 0.1), 0 4px 6px -2px rgba(237, 109, 17, 0.05)',
      },
    },
  },
  plugins: [],
}
