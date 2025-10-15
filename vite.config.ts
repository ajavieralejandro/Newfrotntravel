import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/Newfrotntravel/src/main.tsx'], // 👈 entrada TSX
      buildDirectory: 'build-newfrotntravel',               // 👈 coincide con el Blade
      hotFile: 'public/hot-newfrotntravel',                 // evita colisiones con otros dev servers
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@components':  path.resolve(__dirname, 'src/components'),
      '@context':     path.resolve(__dirname, 'src/context'),
      '@hooks':       path.resolve(__dirname, 'src/hooks'),
      '@interfaces':  path.resolve(__dirname, 'src/interfaces'),
      '@services':    path.resolve(__dirname, 'src/services'),
      '@pages':       path.resolve(__dirname, 'src/pages'),
      '@data':        path.resolve(__dirname, 'src/data'),
      '@utils':       path.resolve(__dirname, 'src/utils'),
      '@assets':      path.resolve(__dirname, 'src/assets'),
    },
  },
  define: {
    'process.env': {},
  },
})
