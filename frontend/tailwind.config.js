/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50:  '#1a2236',
          100: '#121a2e',
          200: '#0d1220',
          300: '#090e18',
          400: '#050810',
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'blue-violet':      'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'blue-cyan':        'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'violet-pink':      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      },
      boxShadow: {
        'glow-xs':     '0 0 15px rgba(59,130,246,0.30)',
        'glow-sm':     '0 0 25px rgba(59,130,246,0.35)',
        'glow-md':     '0 0 40px rgba(59,130,246,0.40)',
        'glow-lg':     '0 0 60px rgba(59,130,246,0.45)',
        'glow-violet': '0 0 40px rgba(139,92,246,0.40)',
        'card':        '0 1px 3px rgba(0,0,0,0.08)',
        'card-md':     '0 4px 16px rgba(0,0,0,0.08)',
        'card-lg':     '0 10px 40px rgba(0,0,0,0.10)',
        'card-xl':     '0 20px 60px rgba(0,0,0,0.12)',
        'premium':     '0 25px 50px rgba(0,0,0,0.08), 0 0 40px rgba(59,130,246,0.06)',
        'premium-dark':'0 25px 50px rgba(0,0,0,0.50), 0 0 40px rgba(59,130,246,0.12)',
      },
      animation: {
        'float':         'float 7s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2.5s infinite',
        'float-slow':    'float 10s ease-in-out 1.2s infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'gradient-x':    'gradientX 8s ease infinite',
        'fade-up':       'fadeUp 0.7s ease-out forwards',
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'shimmer':       'shimmer 2s linear infinite',
        'spin-slow':     'spin 20s linear infinite',
        'slide-up':      'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)',   opacity: '0.6' },
          '33%':     { transform: 'translateY(-18px) rotate(3deg)', opacity: '0.9' },
          '66%':     { transform: 'translateY(-8px) rotate(-2deg)', opacity: '0.75' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(59,130,246,0.35)' },
          '50%':     { boxShadow: '0 0 50px rgba(139,92,246,0.6)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
