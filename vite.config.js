import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/tools/',
    plugins: [
        tailwindcss(),
    ],
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
