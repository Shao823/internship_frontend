import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const isAntDesignPackage = (id: string) =>
  [
    '/antd/',
    '/@ant-design/',
    '/@rc-component/',
    '/rc-',
    '/dayjs/',
    '/classnames/',
    '/async-validator/',
    '/copy-to-clipboard/',
    '/compute-scroll-into-view/',
    '/scroll-into-view-if-needed/',
    '/throttle-debounce/',
  ].some((packageName) => id.includes(`/node_modules${packageName}`));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    exclude: [
      'echarts',
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers',
    ],
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'react-vendor';
          }

          if (id.includes('/echarts/') || id.includes('/zrender/')) {
            return 'echarts-vendor';
          }

          if (isAntDesignPackage(id)) {
            return 'antd-vendor';
          }

          if (id.includes('/axios/')) {
            return 'http-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});
