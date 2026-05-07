import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  /**
   * Symfony URL for the dev proxy.
   * - Host machine dev: `http://localhost:8080` (or Symfony CLI on `:8000`)
   * - Dockerized Vite dev server: `http://backend`
   */
  const backend =
    process.env.VITE_PROXY_TARGET ||
    env.VITE_PROXY_TARGET ||
    process.env.VITE_API_URL ||
    env.VITE_API_URL ||
    'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true,
        },
        '/uploads': {
          target: backend,
          changeOrigin: true,
        },
      },
    },
  };
});
