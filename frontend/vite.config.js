import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://transitsng.onrender.com')
  },
  optimizeDeps: {
    include: [
      'react-leaflet',
      'leaflet'
    ],
    exclude: ['@vitejs/plugin-react']
  },
  build: {
    commonjsOptions: {
      include: [/react-leaflet/, /leaflet/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: []
    }
  },
  ssr: {
    noExternal: ['react-leaflet']
  }
});