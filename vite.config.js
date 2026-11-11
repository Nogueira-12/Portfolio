import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // relative paths: the same build works at a domain root (Vercel) and under /Portfolio/ (GitHub Pages)
  base: './',
  build: {
    target: 'es2020',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['motion/react'],
        },
      },
    },
  },
});
