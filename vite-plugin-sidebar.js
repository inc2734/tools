import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Nav items definition (shared with nav.js for behavior)
const navItems = [
    {
        label: 'ホーム',
        href: './',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>',
        id: 'home'
    },
    {
        label: 'Unicode 文字変換',
        href: './unicode/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>',
        id: 'unicode'
    },
    {
        label: 'JSON 整形',
        href: './json/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
        id: 'json'
    },
    {
        label: 'Prettier 整形',
        href: './prettier/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>',
        id: 'prettier'
    },
    {
        label: 'ランダム文字列生成',
        href: './random/',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>',
        id: 'random'
    }
];

function detectPageId(filename) {
    if (filename.includes('unicode')) return 'unicode';
    if (filename.includes('json')) return 'json';
    if (filename.includes('prettier')) return 'prettier';
    if (filename.includes('random')) return 'random';
    return 'home';
}

function getBasePath(pageId) {
    return pageId === 'home' ? './' : '../';
}

function buildSidebarHtml(pageId) {
    const basePath = getBasePath(pageId);

    const itemsHtml = navItems.map(item => {
        const href = basePath + item.href.replace('./', '');
        const isActive = item.id === pageId;
        const activeClass = isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-l-2 border-indigo-500'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 border-l-2 border-transparent';
        return `
                <a href="${href}" class="flex items-center px-4 py-3 text-sm font-medium ${activeClass} transition-colors">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${item.icon}</svg>
                    <span class="whitespace-nowrap">${item.label}</span>
                </a>`;
    }).join('\n');

    // Hamburger button HTML for mobile (inserted into header by nav.js is removed, now static)
    const mobileHamburger = `
    <button id="sidebar-toggle-mobile" class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer mr-2 flex-shrink-0" aria-label="ナビゲーション切り替え">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    </button>`;

    // Inline script to immediately apply sidebar state from localStorage (prevents flicker)
    const inlineScript = `
    <script>
        (function() {
            var STORAGE_KEY = 'tools-nav-open';
            var DESKTOP_BP = 1024;
            var isDesktop = window.innerWidth >= DESKTOP_BP;
            var stored = localStorage.getItem(STORAGE_KEY);
            var open = stored === null ? true : stored === 'true';
            var sidebar = document.getElementById('sidebar-nav');
            var overlay = document.getElementById('sidebar-overlay');
            if (isDesktop) {
                sidebar.style.width = open ? '14rem' : '3.25rem';
                sidebar.style.transform = 'translateX(0)';
                document.body.style.marginLeft = open ? '14rem' : '3.25rem';
                if (!open) {
                    var links = document.getElementById('sidebar-links');
                    var title = document.getElementById('sidebar-title');
                    if (links) links.style.display = 'none';
                    if (title) title.style.display = 'none';
                }
            } else {
                sidebar.style.transform = 'translateX(-100%)';
                sidebar.style.width = '14rem';
            }
        })();
    </script>`;

    return `
    <!-- Sidebar Navigation -->
    <aside id="sidebar-nav" class="fixed top-0 left-0 h-full z-[60]" style="transform: translateX(-100%);">
        <nav class="h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div id="sidebar-header" class="px-3 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center min-h-[57px]">
                <button id="sidebar-toggle" class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0" aria-label="ナビゲーション切り替え">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <span id="sidebar-title" class="ml-2 text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 whitespace-nowrap">Tools</span>
            </div>
            <div id="sidebar-links" class="flex-grow py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
${itemsHtml}
            </div>
        </nav>
    </aside>
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[55] opacity-0 pointer-events-none lg:hidden" style="transition: opacity 300ms;"></div>
    ${inlineScript}
    <!-- Mobile hamburger: {{MOBILE_HAMBURGER}} -->
`;
}

export default function sidebarPlugin() {
    return {
        name: 'vite-plugin-sidebar',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                const pageId = detectPageId(ctx.filename);
                const sidebarHtml = buildSidebarHtml(pageId);

                // Inject sidebar right after <body...>
                html = html.replace(/(<body[^>]*>)/, `$1\n${sidebarHtml}`);

                // Inject mobile hamburger into header's left group
                const mobileHamburger = `<button id="sidebar-toggle-mobile" class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer mr-2 flex-shrink-0" aria-label="ナビゲーション切り替え"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>`;

                // For tool pages: insert before the first h1 inside the left group div
                if (pageId !== 'home') {
                    // Match the opening of the left flex group in the header
                    html = html.replace(
                        /(<div class="flex items-center space-x-6">)\s*\n(\s*<h1)/,
                        `$1\n                ${mobileHamburger}\n$2`
                    );
                } else {
                    // Home page: wrap h1 with hamburger
                    html = html.replace(
                        /(<div class="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">)\s*\n(\s*<h1)/,
                        `$1\n      <div class="flex items-center">\n        ${mobileHamburger}\n$2`
                    );
                    // Close the wrapper after h1
                    html = html.replace(
                        /(<\/h1>)\s*\n(\s*<\/div>\s*\n\s*<\/header>)/,
                        `$1\n      </div>\n$2`
                    );
                }

                return html;
            }
        }
    };
}
