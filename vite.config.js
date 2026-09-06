import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        download: resolve(process.cwd(), 'download/index.html'),
        updates: resolve(process.cwd(), 'changelog/index.html'),
        premium: resolve(process.cwd(), 'premium/index.html'),
        plus: resolve(process.cwd(), 'plus/index.html'),
        checkout: resolve(process.cwd(), 'checkout/index.html'),
        legal: resolve(process.cwd(), 'legal/index.html'),
        notFound: resolve(process.cwd(), '404.html')
      }
    }
  }
});
