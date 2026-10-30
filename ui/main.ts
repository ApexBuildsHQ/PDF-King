import { categories, toolThemes, CategoryDef, ToolDef } from './config/tools.js';
import { dom, switchView, hideAlert } from './ui.js';
import { state } from './state.js';
import { setupToolInterface } from './handlers/toolSelectionHandler.js';
import { createIcons, icons } from 'lucide';
import * as pdfjsLib from 'pdfjs-dist';
import { t, initI18n, setLanguage, getLanguage, onLanguageChange, translateDOM, availableLanguages } from './i18n.js';
import { triggerDirectLink } from './utils/directLink.js';
import { getAllHistoryRecords, deleteHistoryRecord, ProcessedHistoryItem } from './utils/historyDb.js';
import { formatBytes } from './utils/helpers.js';
import { mountSecurityGuarantees } from '../components/SecurityGuarantees.js';
import { mountFAQSection } from '../components/FAQSection.js';
import { mountFooter } from '../components/Footer.js';
import "../css/styles.css";

// Global Application State
let activeCategoryKey = 'all'; // Default to 'all' so users see all available tools
let currentSearchTerm = '';

// Helper to refresh Lucide icons
export const refreshIcons = () => {
    try {
        createIcons({ icons });
    } catch (e) {
        console.error('Error refreshing icons', e);
    }
};

// Theme Management (Light / Dark)
const initTheme = () => {
    const savedTheme = localStorage.getItem('pdfking_theme');
    // Default to 'dark' as seen in the user's screenshot
    const isDark = savedTheme ? savedTheme === 'dark' : true;

    applyTheme(isDark ? 'dark' : 'light');

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentIsDark = document.documentElement.classList.contains('dark');
            applyTheme(currentIsDark ? 'light' : 'dark');
        });
    }

    const modalDarkBtn = document.getElementById('btn-theme-dark');
    const modalLightBtn = document.getElementById('btn-theme-light');

    modalDarkBtn?.addEventListener('click', () => applyTheme('dark'));
    modalLightBtn?.addEventListener('click', () => applyTheme('light'));
};

const applyTheme = (theme: 'dark' | 'light') => {
    const isDark = theme === 'dark';
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('pdfking_theme', theme);

    // Update icons in toggle button safely without setting SVG.className
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = `<i id="theme-icon" data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5 ${isDark ? 'text-amber-500' : 'text-indigo-600'}"></i>`;
    }

    refreshIcons();
};

// Category Tabs Rendering & Selection
const renderCategoryPills = () => {
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    container.innerHTML = '';

    categories.forEach(cat => {
        const pill = document.createElement('button');
        const isActive = cat.key === activeCategoryKey;
        pill.className = `category-pill flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold cursor-pointer ${
            isActive ? 'active' : ''
        }`;
        pill.dataset.categoryKey = cat.key;

        // Icon
        const iconEl = document.createElement('i');
        iconEl.className = 'w-4 h-4';
        iconEl.setAttribute('data-lucide', cat.icon);

        // Label translated via t()
        const textEl = document.createElement('span');
        textEl.textContent = t(`categories.${cat.key}`);

        pill.append(iconEl, textEl);

        pill.addEventListener('click', () => {
            if (activeCategoryKey !== cat.key) {
                activeCategoryKey = cat.key;
                updatePillsActiveState();
                renderToolGrid();
            }
        });

        container.appendChild(pill);
    });

    refreshIcons();
};

const updatePillsActiveState = () => {
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    container.querySelectorAll<HTMLButtonElement>('.category-pill').forEach(pill => {
        const isCurrent = pill.dataset.categoryKey === activeCategoryKey;
        pill.classList.toggle('active', isCurrent);
    });
};

let currentGridObserver: IntersectionObserver | null = null;

const createToolCardElement = (tool: ToolDef): HTMLElement => {
    const theme = toolThemes[tool.colorTheme || 'blue'] || toolThemes.blue;

    const card = document.createElement('div');
    card.className = 'tool-card group p-5 sm:p-6 cursor-pointer flex flex-col justify-between border';
    card.dataset.toolId = tool.id;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'flex flex-col items-start text-start w-full';

    // Colored Squircle Icon Badge
    const iconBadge = document.createElement('div');
    iconBadge.className = `w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${theme.bg} ${theme.text} ${theme.border} border shadow-xs`;

    const icon = document.createElement('i');
    icon.className = 'w-6 h-6';
    icon.setAttribute('data-lucide', tool.icon);
    iconBadge.appendChild(icon);

    // Tool Title
    const title = document.createElement('h3');
    title.className = 'tool-card-title text-lg sm:text-xl font-bold mb-2 transition-colors tracking-tight';
    title.textContent = t(`tools.${tool.id}.name`);

    // Tool Subtitle / Description
    const desc = document.createElement('p');
    desc.className = 'tool-card-subtitle text-sm sm:text-base leading-relaxed font-normal';
    desc.textContent = t(`tools.${tool.id}.subtitle`);

    contentWrapper.append(iconBadge, title, desc);
    card.appendChild(contentWrapper);

    card.addEventListener('click', () => {
        const activeToolTitle = document.getElementById('active-tool-title');
        if (activeToolTitle) {
            activeToolTitle.textContent = t(`tools.${tool.id}.name`);
        }
        setupToolInterface(tool.id);
        refreshIcons();
    });

    return card;
};

// Tool Cards Grid Rendering with progressive lazy loading for smooth 60fps performance
const renderToolGrid = () => {
    const grid = dom.toolGrid;
    if (!grid) return;

    if (currentGridObserver) {
        currentGridObserver.disconnect();
        currentGridObserver = null;
    }

    grid.innerHTML = '';

    let toolsToDisplay: ToolDef[] = [];

    if (currentSearchTerm) {
        // Search across all unique tools
        const seen = new Set<string>();
        categories.forEach(cat => {
            cat.tools.forEach(tool => {
                if (!seen.has(tool.id)) {
                    seen.add(tool.id);
                    const name = t(`tools.${tool.id}.name`).toLowerCase();
                    const subtitle = t(`tools.${tool.id}.subtitle`).toLowerCase();
                    if (name.includes(currentSearchTerm) || subtitle.includes(currentSearchTerm)) {
                        toolsToDisplay.push(tool);
                    }
                }
            });
        });
    } else {
        const currentCategory = categories.find(c => c.key === activeCategoryKey);
        toolsToDisplay = currentCategory ? currentCategory.tools : [];
    }

    const noToolsEl = document.getElementById('no-tools-found');
    if (noToolsEl) {
        noToolsEl.classList.toggle('hidden', toolsToDisplay.length > 0);
    }

    if (toolsToDisplay.length === 0) return;

    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    // If in test environment or small count, render all directly
    if (isTest || toolsToDisplay.length <= 28 || typeof IntersectionObserver === 'undefined') {
        const fragment = document.createDocumentFragment();
        toolsToDisplay.forEach(tool => {
            fragment.appendChild(createToolCardElement(tool));
        });
        grid.appendChild(fragment);
        refreshIcons();
        return;
    }

    // High performance Lazy Loading for 100+ cards:
    // Initial batch of 24 cards rendered immediately, followed by progressive batch loading
    const BATCH_SIZE = 24;
    let renderedCount = 0;

    const sentinel = document.createElement('div');
    sentinel.id = 'grid-sentinel';
    sentinel.className = 'col-span-full h-8 w-full pointer-events-none opacity-0';

    const renderBatch = () => {
        const nextBatch = toolsToDisplay.slice(renderedCount, renderedCount + BATCH_SIZE);
        if (nextBatch.length === 0) {
            if (sentinel.parentNode === grid) {
                grid.removeChild(sentinel);
            }
            if (currentGridObserver) {
                currentGridObserver.disconnect();
                currentGridObserver = null;
            }
            return;
        }

        const fragment = document.createDocumentFragment();
        nextBatch.forEach(tool => {
            fragment.appendChild(createToolCardElement(tool));
        });

        if (sentinel.parentNode === grid) {
            grid.insertBefore(fragment, sentinel);
        } else {
            grid.appendChild(fragment);
        }

        renderedCount += nextBatch.length;
        refreshIcons();

        if (renderedCount >= toolsToDisplay.length) {
            if (sentinel.parentNode === grid) {
                grid.removeChild(sentinel);
            }
            if (currentGridObserver) {
                currentGridObserver.disconnect();
                currentGridObserver = null;
            }
        }
    };

    // Render initial batch
    renderBatch();

    // If remaining tools exist, attach IntersectionObserver to sentinel
    if (renderedCount < toolsToDisplay.length) {
        grid.appendChild(sentinel);
        currentGridObserver = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                renderBatch();
            }
        }, {
            root: null,
            rootMargin: '400px', // Trigger ahead of time so users experience seamless scrolling
            threshold: 0.01
        });
        currentGridObserver.observe(sentinel);
    }
};

// History Management with IndexedDB
const renderHistoryList = async () => {
    const container = document.getElementById('history-list');
    if (!container) return;

    const list = await getAllHistoryRecords();
    if (list.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 bg-white dark:bg-[#162032] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-xs">
                <div class="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="history" class="w-8 h-8"></i>
                </div>
                <p class="text-gray-600 dark:text-gray-300 font-bold mb-1">${t('history.empty')}</p>
            </div>
        `;
        refreshIcons();
        return;
    }

    container.innerHTML = '';
    list.forEach((item: ProcessedHistoryItem) => {
        const card = document.createElement('div');
        card.className = 'group relative bg-white dark:bg-[#162032] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all p-4 sm:p-5 flex flex-col gap-3.5';

        // 1. Top Meta Bar (Tool Badge + Date & Time)
        const topBar = document.createElement('div');
        topBar.className = 'flex items-center justify-between gap-2 flex-wrap';

        const toolBadge = document.createElement('div');
        toolBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400';
        const translatedToolName = t(`tools.${item.toolId}.name`);
        const displayToolName = (!translatedToolName.startsWith('tools.') ? translatedToolName : item.toolName) || 'PDF King';
        toolBadge.innerHTML = `<i data-lucide="wrench" class="w-3.5 h-3.5 flex-shrink-0"></i> <span>${displayToolName}</span>`;

        const dateEl = document.createElement('div');
        dateEl.className = 'inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium';
        const date = new Date(item.timestamp);
        dateEl.innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5 flex-shrink-0"></i> <span>${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${date.toLocaleDateString()}</span>`;

        topBar.append(toolBadge, dateEl);

        // 2. Middle Row (File Icon + File Name & Size)
        const fileRow = document.createElement('div');
        fileRow.className = 'flex items-center gap-3.5';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 ring-1 ring-amber-500/20';
        const icon = document.createElement('i');
        icon.className = 'w-6 h-6';
        icon.setAttribute('data-lucide', 'file-text');
        iconWrap.appendChild(icon);

        const fileDetails = document.createElement('div');
        fileDetails.className = 'flex-1 min-w-0';

        const fileNameWrap = document.createElement('div');
        fileNameWrap.className = 'flex items-center gap-2 flex-wrap';

        const fileNameEl = document.createElement('h4');
        fileNameEl.className = 'font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-full';
        fileNameEl.title = item.fileName;
        fileNameEl.textContent = item.fileName;

        const sizeBadge = document.createElement('span');
        sizeBadge.className = 'text-xs px-2 py-0.5 rounded-md font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
        sizeBadge.textContent = formatBytes(item.fileSize);

        fileNameWrap.append(fileNameEl, sizeBadge);
        fileDetails.appendChild(fileNameWrap);
        fileRow.append(iconWrap, fileDetails);

        // 3. Bottom Row (Action Bar with Divider: Download Button & Delete Button)
        const actionBar = document.createElement('div');
        actionBar.className = 'pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-3';

        // Re-download Button: triggers direct ad link (respecting 5-min freeze) + regenerates Blob URL
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-xs hover:shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer';
        downloadBtn.innerHTML = `<i data-lucide="download" class="w-4 h-4 flex-shrink-0"></i> <span>${t('history.redownload')}</span>`;
        downloadBtn.addEventListener('click', () => {
            // 1. Trigger the direct ad link (enters 5-min freeze cooldown)
            triggerDirectLink('process');

            // 2. Re-generate Blob URL from the stored Blob and trigger download
            const url = URL.createObjectURL(item.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });

        // Delete Item Button with stylish icon frame
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700/80 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer';
        deleteBtn.title = t('history.delete');
        deleteBtn.innerHTML = `<i data-lucide="trash-2" class="w-4 h-4"></i>`;
        deleteBtn.addEventListener('click', async () => {
            await deleteHistoryRecord(item.id);
            renderHistoryList();
        });

        actionBar.append(downloadBtn, deleteBtn);

        card.append(topBar, fileRow, actionBar);
        container.appendChild(card);
    });

    refreshIcons();
};

// Bottom Navigation Switching
const switchAppTab = (tab: 'home' | 'features' | 'history') => {
    const mainView = document.getElementById('main-view');
    const featuresView = document.getElementById('features-view');
    const historyView = document.getElementById('history-view');
    const footerContainer = document.getElementById('footer-container');

    const tabHome = document.getElementById('tab-home');
    const tabFeatures = document.getElementById('tab-features');
    const tabHistory = document.getElementById('tab-history');

    [tabHome, tabFeatures, tabHistory].forEach(btn => btn?.classList.remove('active'));

    if (tab === 'home') {
        mainView?.classList.remove('hidden');
        featuresView?.classList.add('hidden');
        historyView?.classList.add('hidden');
        footerContainer?.classList.remove('hidden');
        tabHome?.classList.add('active');
        switchView('grid');
    } else if (tab === 'features') {
        mainView?.classList.add('hidden');
        featuresView?.classList.remove('hidden');
        historyView?.classList.add('hidden');
        footerContainer?.classList.remove('hidden');
        tabFeatures?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'history') {
        mainView?.classList.add('hidden');
        featuresView?.classList.add('hidden');
        historyView?.classList.remove('hidden');
        footerContainer?.classList.add('hidden');
        tabHistory?.classList.add('active');
        renderHistoryList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    refreshIcons();
};

// Settings Modal Management
const initSettingsModal = () => {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('header-settings-btn');
    const closeBtn = document.getElementById('close-settings-modal');
    const doneBtn = document.getElementById('done-settings-btn');
    const langContainer = document.getElementById('language-options-grid');

    const renderLangButtons = () => {
        if (!langContainer) return;
        langContainer.innerHTML = '';
        const currentLang = getLanguage();

        availableLanguages.forEach(lang => {
            const isSelected = lang.code === currentLang;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = `btn-lang-${lang.code}`;
            btn.className = `py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
            }`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'truncate';
            nameSpan.textContent = lang.nativeName;

            const rightWrap = document.createElement('div');
            rightWrap.className = 'flex items-center gap-1.5 shrink-0';

            const codeSpan = document.createElement('span');
            codeSpan.className = 'text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400';
            codeSpan.textContent = lang.code;
            rightWrap.appendChild(codeSpan);

            if (isSelected) {
                const icon = document.createElement('i');
                icon.setAttribute('data-lucide', 'check');
                icon.className = 'w-4 h-4 text-amber-500';
                rightWrap.appendChild(icon);
            }

            btn.append(nameSpan, rightWrap);

            btn.addEventListener('click', () => {
                setLanguage(lang.code);
                renderLangButtons();
                renderCategoryPills();
                renderToolGrid();
            });

            langContainer.appendChild(btn);
        });

        refreshIcons();
    };

    const closeModal = () => modal?.classList.add('hidden');

    openBtn?.addEventListener('click', () => {
        renderLangButtons();
        modal?.classList.remove('hidden');
    });

    closeBtn?.addEventListener('click', closeModal);
    doneBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    renderLangButtons();
};

// Initialization entry point
const init = () => {
    // 1. Worker Configuration
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
    ).toString();

    // 2. Initialize i18n
    initI18n();

    // 3. Initialize Theme
    initTheme();

    // 4. Initial Component Rendering
    renderCategoryPills();
    renderToolGrid();
    mountSecurityGuarantees('security-guarantees-container');
    mountFAQSection('faq-section-container');
    mountFooter('footer-container');
    initSettingsModal();

    // 5. Search Bar Handling
    const searchBar = document.getElementById('search-bar') as HTMLInputElement | null;
    if (searchBar) {
        searchBar.addEventListener('input', () => {
            currentSearchTerm = searchBar.value.toLowerCase().trim();
            renderToolGrid();
        });
    }

    // 6. Navigation Buttons
    document.getElementById('brand-logo')?.addEventListener('click', () => switchAppTab('home'));
    document.getElementById('tab-home')?.addEventListener('click', () => switchAppTab('home'));
    document.getElementById('tab-features')?.addEventListener('click', () => switchAppTab('features'));
    document.getElementById('tab-history')?.addEventListener('click', () => switchAppTab('history'));

    // 7. Back to Grid & Alert Actions
    dom.backToGridBtn?.addEventListener('click', () => {
        switchView('grid');
        refreshIcons();
    });
    dom.alertOkBtn?.addEventListener('click', hideAlert);

    // 9. Global Listener strictly for the tool process button (#process-btn / #crop-button) only
    document.getElementById('tool-content')?.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const processBtn = target.closest<HTMLButtonElement>('#process-btn, #crop-button');
        if (processBtn && !processBtn.disabled) {
            triggerDirectLink('process');
        }
    });

    // 10. Re-render on language change
    onLanguageChange(() => {
        renderCategoryPills();
        renderToolGrid();
        renderHistoryList();
        mountSecurityGuarantees('security-guarantees-container');
        mountFAQSection('faq-section-container');
        mountFooter('footer-container');
        translateDOM();
        refreshIcons();
        if (state.activeTool) {
            const h2 = dom.toolContent.querySelector('h2');
            if (h2) h2.textContent = t(`tools.${state.activeTool}.name`);
            const firstP = dom.toolContent.querySelector('p');
            if (firstP && !firstP.closest('#drop-zone')) firstP.textContent = t(`tools.${state.activeTool}.subtitle`);
            const activeToolTitle = document.getElementById('active-tool-title');
            if (activeToolTitle) activeToolTitle.textContent = t(`tools.${state.activeTool}.name`);
            const processBtn = document.getElementById('process-btn');
            if (processBtn) {
                const btnText = t(`tools.${state.activeTool}.button`);
                if (btnText && btnText !== `tools.${state.activeTool}.button`) {
                    processBtn.textContent = btnText;
                }
            }
        }
    });

    // 11. Initial Icon Generation
    refreshIcons();
};

// Boot the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
