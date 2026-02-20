import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/tools/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                unicode: resolve(__dirname, 'unicode/index.html'),
                json: resolve(__dirname, 'json/index.html')
            }
        }
    }
});
