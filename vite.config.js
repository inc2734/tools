import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';

const navItems = [
    {
        label: 'ホーム',
        hrefRelative: '',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>',
        id: 'home'
    },
    {
        label: 'Unicode 文字変換',
        hrefRelative: 'unicode/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>',
        id: 'unicode'
    },
    {
        label: 'JSON 整形',
        hrefRelative: 'json/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
        id: 'json'
    },
    {
        label: 'Prettier 整形',
        hrefRelative: 'prettier/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
        id: 'prettier'
    },
    {
        label: 'ランダム文字列生成',
        hrefRelative: 'random/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>',
        id: 'random'
    }
];

export default defineConfig({
    base: '/tools/',
    plugins: [
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, 'partials'),
            context(pagePath) {
                const isHome = pagePath === '/index.html' || pagePath === '/';
                const pageId = isHome ? 'home' : pagePath.split('/')[1];

                let titleRaw = 'Tools';
                let icon = '';
                const activeItem = navItems.find(item => item.id === pageId);
                if (activeItem && !isHome) {
                    titleRaw = activeItem.label;
                    icon = `<svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">${activeItem.icon}</svg>`;
                }

                // Add active state to navItems
                const currentNavItems = navItems.map(item => ({
                    ...item,
                    isActive: item.id === pageId
                }));

                return {
                    isHome,
                    pageId,
                    title: isHome ? 'Tools' : `${titleRaw} | Tools`,
                    titleRaw,
                    icon,
                    basePath: isHome ? './' : '../',
                    navItems: currentNavItems
                };
            },
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                unicode: resolve(__dirname, 'unicode/index.html'),
                json: resolve(__dirname, 'json/index.html'),
                prettier: resolve(__dirname, 'prettier/index.html'),
                random: resolve(__dirname, 'random/index.html')
            }
        }
    }
});
