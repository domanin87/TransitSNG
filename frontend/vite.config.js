import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.REACT_APP_API_URL || 'https://transitsng.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/socket.io': {
        target: process.env.REACT_APP_API_URL || 'https://transitsng.onrender.com',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});