import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build')
    return {
      plugins: [react()],
      resolve: {
        alias: {
          './runtimeConfig': './runtimeConfig.browser',
          '~': path.resolve(__dirname, 'node_modules'),
          '@': path.resolve(__dirname, 'src'),
        },
      },
      build: { chunkSizeWarningLimit: 3000 },
    };

  return { define: { global: {} }, plugins: [react()] };
});
