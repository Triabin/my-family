import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();
// 路径拼接函数，简化代码
const pathResolve = (path: string): string => resolve(root, path);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: [
      /** 设置@指向src目录 */
      { find: '@', replacement: pathResolve('src') }
    ],
    extensions: ['.vue', '.css', '.scss', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: import.meta.env?.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
