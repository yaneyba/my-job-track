import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Read build info if it exists
let buildInfo = {};
try {
  const buildInfoPath = path.resolve(__dirname, './src/build-info.json');
  if (fs.existsSync(buildInfoPath)) {
    buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
  }
} catch (error) {
  console.warn('Could not read build info, using defaults');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Inject build timestamp for cache busting
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __PACKAGE_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_INFO__: JSON.stringify(buildInfo),
    },
    build: {
      // Enable rollup options for better cache busting
      rollupOptions: {
        output: {
          // Add hash to filenames for cache busting
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      },
      // Generate source maps for better debugging
      sourcemap: true,
      // Ensure assets are properly hashed
      assetsInlineLimit: 0
    },
    // Add cache headers for development
    server: {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      // Add proxy for development API
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8787',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
