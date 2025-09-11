 // Extensões usadas no seu HTML original (cores e animações)
 tailwind.config = {
    theme: {
      extend: {
        colors: {
          space: { 700: '#1a2444', 800: '#111936', 900: '#0a0f1f' },
          sunflower: { 200:'#fde68a', 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706', 700:'#b45309' },
          'planet-blue': '#6ec9ff',
          'planet-coral': '#ff9f8e',
          'planet-lilac': '#c9b6ff',
          'planet-mint': '#9ff0d7'
        },
        boxShadow: { glow: '0 0 30px rgba(255, 255, 255, .15)' },
        keyframes: {
          float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-6px)' } },
          orbit: { '0%': { transform:'rotate(0deg)' }, '100%': { transform:'rotate(360deg)' } },
          twinkle: { '0%,100%': { opacity:.4 }, '50%': { opacity:1 } },
          pop: { '0%':{ transform:'scale(.96)', opacity:0 }, '100%':{ transform:'scale(1)', opacity:1 } },
          shimmer: { '0%':{ backgroundPosition:'0% 0%' }, '100%':{ backgroundPosition:'200% 0%' } },
        },
        animation: {
          float: 'float 6s ease-in-out infinite',
          orbit: 'orbit 18s linear infinite',
          twinkle: 'twinkle 2.2s ease-in-out infinite',
          pop: 'pop .25s ease-out both',
          shimmer: 'shimmer 3s linear infinite',
        },
        fontFamily: {
          display: ['Playfair Display', 'serif'],
          script: ['Dancing Script', 'cursive'],
          sans: ['Inter', 'system-ui', 'sans-serif'],
        }
      }
    }
  }