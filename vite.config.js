import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import sidebarPlugin from './vite-plugin-sidebar.js';

export default defineConfig({
    base: '/tools/',
    plugins: [
        tailwindcss(),
        sidebarPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                unicode: resolve(__dirname, 'unicode/index.html'),
                json: resolve(__dirname, 'json/index.html'),
                prettier: resolve(__dirname, 'prettier/index.html')
            }
        }
    }
});
