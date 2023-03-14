import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') return { plugins: [react()], build: { chunkSizeWarningLimit: 3000 } };

  return { define: { global: {} }, plugins: [react()] };
});
