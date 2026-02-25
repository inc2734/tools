// Sidebar behavior controller (no DOM creation - HTML is injected at build time by vite-plugin-sidebar)
// Handles: toggle, localStorage persistence, resize breakpoint switching

const STORAGE_KEY = 'tools-nav-open';
const DESKTOP_BREAKPOINT = 1024;
const SIDEBAR_WIDTH = '14rem';
const COLLAPSED_WIDTH = '3.25rem';

function isDesktop() { return window.innerWidth >= DESKTOP_BREAKPOINT; }

function getStoredState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return true;
    return stored === 'true';
}

function setStoredState(open) {
    localStorage.setItem(STORAGE_KEY, String(open));
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileToggle = document.getElementById('sidebar-toggle-mobile');
    const linksEl = document.getElementById('sidebar-links');
    const titleEl = document.getElementById('sidebar-title');

    if (!sidebar) return;

    let sidebarOpen = isDesktop() ? getStoredState() : false;

    function applyStyles(open, animate = true) {
        const desktop = isDesktop();
        const duration = animate ? '300ms' : '0ms';
        const timing = 'cubic-bezier(0.4, 0, 0.2, 1)';

        if (desktop) {
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

            document.body.style.marginLeft = open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;
            document.body.style.transitionProperty = 'margin-left';
            document.body.style.transitionDuration = duration;
            document.body.style.transitionTimingFunction = timing;

            if (linksEl) linksEl.style.display = open ? '' : 'none';
            if (titleEl) titleEl.style.display = open ? '' : 'none';

            overlay.classList.add('opacity-0', 'pointer-events-none');
            overlay.classList.remove('opacity-100');
        } else {
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

            document.body.style.marginLeft = '0';

            if (linksEl) linksEl.style.display = '';
            if (titleEl) titleEl.style.display = '';

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

    // Event listeners
    if (sidebarToggle) sidebarToggle.addEventListener('click', () => toggle());
    if (mobileToggle) mobileToggle.addEventListener('click', () => toggle(true));
    if (overlay) overlay.addEventListener('click', () => toggle(false));

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

    // Apply styles (the inline script already set initial state, but DOMContentLoaded
    // ensures full interactivity with transitions enabled)
    applyStyles(sidebarOpen, false);
});
