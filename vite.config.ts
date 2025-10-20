import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 🔧 Agregamos configuración de Vitest
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  json: {
    namedExports: true,
    stringify: false,
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'components'),
      '@context': path.resolve(__dirname, 'context'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@interfaces': path.resolve(__dirname, 'interfaces'),
      '@services': path.resolve(__dirname, 'services'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@data': path.resolve(__dirname, 'data'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
  
});
