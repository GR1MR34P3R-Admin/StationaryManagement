import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export const vitePort = 3000;

// Determine the base path based on environment
const getBasePath = (mode) => {
  // Use correct base path for GitHub Pages deployment
  if (mode === 'github' || process.env.GITHUB_ACTIONS) {
    // If using a custom domain, use '/'
    if (process.env.CUSTOM_DOMAIN) {
      return '/';
    }
    // If deploying to username.github.io/repo-name, use '/repo-name/'
    const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'stationary-management-system';
    return `/${repo}/`;
  }
  return '/';
};

export default defineConfig(({ mode }) => {
  return {
    base: getBasePath(mode),
    plugins: [
      react(),
      // Custom plugin to handle source map requests
      {
        name: 'handle-source-map-requests',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Check if the request is for a source map file
            if (req.url && req.url.endsWith('.map')) {
              // Rewrite the URL to remove the query string that's causing the issue
              const cleanUrl = req.url.split('?')[0];
              req.url = cleanUrl;
            }
            next();
          });
        },
      },
      // Custom plugin to add CORS headers
      {
        name: 'add-cors-headers',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Add CORS headers to all responses
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader(
              'Access-Control-Allow-Methods',
              'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            );
            res.setHeader(
              'Access-Control-Allow-Headers',
              'Content-Type, Authorization, X-Requested-With',
            );

            // Handle OPTIONS requests
            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              return res.end();
            }

            next();
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client/src'),
      },
    },
    root: path.join(process.cwd(), 'client'),
    build: {
      outDir: path.join(process.cwd(), 'dist/public'),
      emptyOutDir: true,
    },
    clearScreen: false,
    server: {
      hmr: {
        overlay: false,
      },
      host: true,
      port: vitePort,
      allowedHosts: true,
      cors: true, // Enable CORS in the dev server
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    // Enable source maps for development
    css: {
      devSourcemap: true,
    },
    // Ensure source maps are properly generated
    esbuild: {
      sourcemap: true,
    },
  };
});
