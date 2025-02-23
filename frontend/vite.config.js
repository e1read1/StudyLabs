import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Tambahkan ini agar path bersifat relatif
  build: {
    outDir: "dist", // Pastikan output ke dist
  }
});
