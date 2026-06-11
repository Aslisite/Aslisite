import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/@mui/') || id.includes('/@emotion/') || id.includes('/@popperjs/')) {
            return 'mui-vendor';
          }

          if (id.includes('/framer-motion/')) {
            return 'motion-vendor';
          }
        },
      },
    },
  },
});
