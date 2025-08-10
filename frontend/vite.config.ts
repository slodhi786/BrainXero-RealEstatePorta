import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5127',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ Add this
    },
  },
});
