// Shared sidebar navigation for all tool pages
// Desktop: sidebar pushes content. Open = full nav, Closed = thin hamburger column. Always 2-column.
// Mobile: overlay hamburger menu in header, no state persistence.

const STORAGE_KEY = 'tools-nav-open';
const DESKTOP_BREAKPOINT = 1024;
const SIDEBAR_WIDTH = '14rem';     // open width (w-56)
const COLLAPSED_WIDTH = '3.25rem'; // closed width (just hamburger)

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
    }
];

function getBasePath() {
    const path = window.location.pathname;
    const match = path.match(/\/tools\//);
    if (!match) return './';
    const afterTools = path.substring(path.indexOf('/tools/') + 7);
    if (afterTools && afterTools !== '' && afterTools !== 'index.html') return '../';
    return './';
}

function getCurrentPageId() {
    const path = window.location.pathname;
    if (path.includes('/unicode')) return 'unicode';
    if (path.includes('/json')) return 'json';
    if (path.includes('/prettier')) return 'prettier';
    return 'home';
}

function isDesktop() { return window.innerWidth >= DESKTOP_BREAKPOINT; }

function getStoredState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return true;
    return stored === 'true';
}

function setStoredState(open) {
    localStorage.setItem(STORAGE_KEY, String(open));
}

export function initNav() {
    const basePath = getBasePath();
    const currentId = getCurrentPageId();
    let sidebarOpen = isDesktop() ? getStoredState() : false;

    // --- Build nav links ---
    const itemsHtml = navItems.map(item => {
        const href = basePath + item.href.replace('./', '');
        const isActive = item.id === currentId;
        const activeClass = isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-l-2 border-indigo-500'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 border-l-2 border-transparent';
        return `
            <a href="${href}" class="flex items-center px-4 py-3 text-sm font-medium ${activeClass} transition-colors">
                <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${item.icon}</svg>
                <span class="whitespace-nowrap">${item.label}</span>
            </a>
        `;
    }).join('');

    // --- Hamburger button HTML ---
    const hamburgerHtml = `
        <button id="sidebar-toggle" class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0" aria-label="ナビゲーション切り替え">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    `;

    // --- Build sidebar ---
    const sidebar = document.createElement('aside');
    sidebar.id = 'sidebar-nav';
    sidebar.innerHTML = `
        <nav class="h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div id="sidebar-header" class="px-3 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center min-h-[57px]">
                ${hamburgerHtml}
                <span id="sidebar-title" class="ml-2 text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 whitespace-nowrap">Tools</span>
            </div>
            <div id="sidebar-links" class="flex-grow py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
                ${itemsHtml}
            </div>
        </nav>
    `;

    // --- Mobile: also insert hamburger into header ---
    const header = document.querySelector('header');
    let mobileToggleBtn = null;
    if (header) {
        const headerInner = header.querySelector(':scope > div');
        if (headerInner) {
            mobileToggleBtn = document.createElement('button');
            mobileToggleBtn.id = 'sidebar-toggle-mobile';
            mobileToggleBtn.className = 'lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer mr-2 flex-shrink-0';
            mobileToggleBtn.setAttribute('aria-label', 'ナビゲーション切り替え');
            mobileToggleBtn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            `;

            const leftGroup = headerInner.querySelector(':scope > div.flex.items-center');
            if (leftGroup) {
                leftGroup.insertBefore(mobileToggleBtn, leftGroup.firstChild);
            } else {
                const firstChild = headerInner.firstElementChild;
                const wrapper = document.createElement('div');
                wrapper.className = 'flex items-center';
                wrapper.appendChild(mobileToggleBtn);
                if (firstChild) {
                    headerInner.insertBefore(wrapper, firstChild);
                    wrapper.appendChild(firstChild);
                } else {
                    headerInner.prepend(wrapper);
                }
            }
        }
    }

    // --- Overlay (mobile only) ---
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className = 'fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[55] transition-opacity duration-300 opacity-0 pointer-events-none lg:hidden';

    // --- Insert into DOM ---
    document.body.prepend(overlay);
    document.body.prepend(sidebar);

    // --- Sidebar toggle inside sidebar ---
    const sidebarToggle = sidebar.querySelector('#sidebar-toggle');

    // --- Apply layout ---
    function applyStyles(open, animate = true) {
        const desktop = isDesktop();
        const duration = animate ? '300ms' : '0ms';
        const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';

        if (desktop) {
            // Desktop: sidebar is always visible, either full or collapsed
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.height = '100%';
            sidebar.style.zIndex = '60';
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.width = open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;
            sidebar.style.transitionProperty = 'width';
            sidebar.style.transitionDuration = duration;
            sidebar.style.transitionTimingFunction = timing;

            // Push body content
            document.body.style.marginLeft = open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;
            document.body.style.transitionProperty = 'margin-left';
            document.body.style.transitionDuration = duration;
            document.body.style.transitionTimingFunction = timing;

            // Show/hide nav links and title
            const linksEl = sidebar.querySelector('#sidebar-links');
            const titleEl = sidebar.querySelector('#sidebar-title');
            if (open) {
                linksEl.style.display = '';
                titleEl.style.display = '';
            } else {
                linksEl.style.display = 'none';
                titleEl.style.display = 'none';
            }

            // Hide overlay on desktop
            overlay.classList.add('opacity-0', 'pointer-events-none');
            overlay.classList.remove('opacity-100');

        } else {
            // Mobile: overlay sidebar
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.height = '100%';
            sidebar.style.zIndex = '60';
            sidebar.style.width = SIDEBAR_WIDTH;
            sidebar.style.transform = open ? 'translateX(0)' : 'translateX(-100%)';
            sidebar.style.transitionProperty = 'transform';
            sidebar.style.transitionDuration = duration;
            sidebar.style.transitionTimingFunction = timing;

            // No content push on mobile
            document.body.style.marginLeft = '0';

            // Always show links and title on mobile (sidebar is either fully visible or hidden)
            const linksEl = sidebar.querySelector('#sidebar-links');
            const titleEl = sidebar.querySelector('#sidebar-title');
            linksEl.style.display = '';
            titleEl.style.display = '';

            // Overlay
            if (open) {
                overlay.classList.remove('opacity-0', 'pointer-events-none');
                overlay.classList.add('opacity-100');
            } else {
                overlay.classList.add('opacity-0', 'pointer-events-none');
                overlay.classList.remove('opacity-100');
            }
        }
    }

    function toggle(forceState) {
        const newState = forceState !== undefined ? forceState : !sidebarOpen;
        if (newState === sidebarOpen) return;
        sidebarOpen = newState;
        applyStyles(sidebarOpen, true);
        if (isDesktop()) setStoredState(sidebarOpen);
    }

    // --- Event listeners ---
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => toggle());
    }
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => toggle(true));
    }
    overlay.addEventListener('click', () => toggle(false));

    // Resize handler
    let wasDesktop = isDesktop();
    window.addEventListener('resize', () => {
        const nowDesktop = isDesktop();
        if (nowDesktop !== wasDesktop) {
            wasDesktop = nowDesktop;
            sidebarOpen = nowDesktop ? getStoredState() : false;
            applyStyles(sidebarOpen, false);
        }
    });

    // --- Initial render ---
    applyStyles(sidebarOpen, false);
}
