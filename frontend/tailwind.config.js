/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: '#0a0908',
        ebony: '#131110',
        ivory: '#f5efe6',
        champagne: '#e6d1ad',
        gold: '#c5a46d',
        beige: '#d9c6ac'
      },
      boxShadow: {
        gold: '0 10px 35px rgba(197, 164, 109, 0.25)',
        glass: '0 20px 40px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at 15% 20%, rgba(197,164,109,0.22), transparent 40%), radial-gradient(circle at 85% 75%, rgba(245,239,230,0.12), transparent 42%), linear-gradient(135deg, #0b0908 0%, #171310 52%, #2a2118 100%)',
        banner: 'linear-gradient(120deg, rgba(11,9,8,0.96), rgba(26,20,15,0.93))'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Manrope"', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shine: 'shine 7s linear infinite',
        fadeUp: 'fadeUp 1s ease-out forwards'
      }
    }
  },
  plugins: []
}