import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'terminal-hacker-core': path.resolve(__dirname, '../backend/rust-core/pkg')
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      overlay: false
    },
    fs: {
      allow: [
        '..',  // Allow parent directory access
        '../backend/rust-core/pkg'  // Explicitly allow WebAssembly directory
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    allowedHosts: ['ce4d57e3-f437-4569-b1bd-1c823ae1935b-00-ewfnnov8wpn5.riker.replit.dev', 'all'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['terminal-hacker-core']
  }
});