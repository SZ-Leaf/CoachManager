import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
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
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes, req) => {
              const url = req.url ?? '';
              if (
                proxyRes.statusCode === 404 &&
                url.includes('roll-call')
              ) {
                console.warn(
                  `\n[vite] 404 sur ${url} — le backend sur ${backend} n’expose pas cette route (code obsolète ou mauvais projet). ` +
                    'Depuis backend/: php bin/console cache:clear puis redémarre le serveur (ex. symfony server:stop && symfony server:start). ' +
                    'Vérifie aussi VITE_PROXY_TARGET si Symfony n’est pas sur ce port.\n',
                );
              }
            });
          },
        },
        '/uploads': {
          target: backend,
          changeOrigin: true,
        },
      },
    },
  };
});
