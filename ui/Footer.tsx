/**
 * Footer Component
 * Site-wide 4-column footer with enlarged typography, dynamic year,
 * exclusive Telegram official community card (no GitHub/Twitter),
 * and Telegram-exclusive Contact Modal without forms or email.
 */

import { icons, createIcons } from 'lucide';
import { t } from '../js/i18n.js';

export function renderFooterHTML(): string {
    const currentYear = new Date().getFullYear();

    return `
    <footer id="site-footer" class="w-full mt-16 pt-12 pb-24 sm:pb-12 border-t border-gray-200/80 dark:border-gray-800/80 transition-colors">
        <div class="max-w-5xl mx-auto px-4 sm:px-6">
            <!-- 4 Columns Grid: 1 col on mobile, 4 cols on md+ screens -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-10 items-start">

                <!-- Column 1: Identity & Copyright -->
                <div class="space-y-3.5">
                    <div class="inline-flex items-center gap-2.5 cursor-pointer select-none" id="footer-brand-logo" dir="ltr">
                        <div class="relative flex items-center justify-center shrink-0">
                            <i data-lucide="crown" class="w-7 h-7 text-amber-500 fill-amber-400 drop-shadow-xs"></i>
                        </div>
                        <span class="text-2xl font-black tracking-tight whitespace-nowrap inline-flex items-center">
                            <span class="text-gray-900 dark:text-white">PDF</span><span class="text-amber-500 font-extrabold">King</span>
                        </span>
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm" data-i18n="footer.desc">
                        ${t('footer.desc')}
                    </p>
                    <div class="text-sm text-gray-500 dark:text-gray-400 font-semibold pt-1">
                        <span data-i18n="footer.copyright">${t('footer.copyright', { year: currentYear })}</span>
                    </div>
                </div>

                <!-- Column 2: Quick Links (No static h4) -->
                <div>
                    <ul class="space-y-3.5 pt-1">
                        <li>
                            <button type="button" id="footer-link-about" class="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all text-start cursor-pointer flex items-center gap-2" data-i18n="footer.link_about">
                                ${t('footer.link_about')}
                            </button>
                        </li>
                        <li>
                            <button type="button" id="footer-link-faq" class="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all text-start cursor-pointer flex items-center gap-2" data-i18n="footer.link_faq">
                                ${t('footer.link_faq')}
                            </button>
                        </li>
                        <li>
                            <button type="button" id="footer-link-contact" class="open-contact-modal-btn text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-all text-start cursor-pointer flex items-center gap-2" data-i18n="footer.link_contact">
                                ${t('footer.link_contact')}
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Column 3: Legal (No static h4) -->
                <div>
                    <ul class="space-y-3.5 pt-1">
                        <li>
                            <button type="button" id="footer-link-privacy" class="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all text-start cursor-pointer flex items-center gap-2" data-i18n="footer.link_privacy">
                                ${t('footer.link_privacy')}
                            </button>
                        </li>
                        <li>
                            <button type="button" id="footer-link-terms" class="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all text-start cursor-pointer flex items-center gap-2" data-i18n="footer.link_terms">
                                ${t('footer.link_terms')}
                            </button>
                        </li>
                        <li>
                            <button type="button" id="footer-link-license" class="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all text-start cursor-pointer flex items-center gap-2" data-i18n="footer.link_license">
                                ${t('footer.link_license')}
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Column 4: Official Telegram Community Exclusively -->
                <div class="flex items-center md:justify-end">
                    <a href="https://t.me/PDFKing23" target="_blank" rel="noopener noreferrer" class="w-11 h-11 rounded-2xl bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white border border-sky-500/20 hover:border-sky-500 flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-sky-500/30 cursor-pointer group" title="${t('footer.telegram')}" aria-label="${t('footer.telegram')}">
                        <i data-lucide="send" class="w-5 h-5 transition-transform group-hover:scale-110"></i>
                    </a>
                </div>

            </div>
        </div>
    </footer>

    <!-- Contact Us Modal (Telegram Official Channel Exclusively) -->
    <div id="contact-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-[#162032] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl relative space-y-6 text-center">
            <button id="close-contact-modal" class="absolute top-4 end-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <!-- Telegram Icon Badge -->
            <div class="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-500 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center mx-auto shadow-xs">
                <i data-lucide="send" class="w-8 h-8"></i>
            </div>

            <div class="space-y-2">
                <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white" data-i18n="footer.contact_modal_title">
                    ${t('footer.contact_modal_title')}
                </h3>
                <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium" data-i18n="footer.contact_modal_desc">
                    ${t('footer.contact_modal_desc')}
                </p>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400" data-i18n="footer.contact_modal_sub">
                    ${t('footer.contact_modal_sub')}
                </p>
            </div>

            <!-- Single Prominent CTA Button -->
            <div class="pt-2">
                <a href="https://t.me/PDFKing23" target="_blank" rel="noopener noreferrer" class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all">
                    <i data-lucide="send" class="w-5 h-5"></i>
                    <span data-i18n="footer.contact_modal_btn">${t('footer.contact_modal_btn')}</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Legal & Information Modal -->
    <div id="legal-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-[#162032] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl relative space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 id="legal-modal-title" class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-5 h-5 text-amber-500"></i>
                    <span></span>
                </h3>
                <button id="close-legal-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <p id="legal-modal-body" class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal"></p>
            <div class="pt-2">
                <button id="legal-modal-ok" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors cursor-pointer" data-i18n="actions.ok">
                    ${t('actions.ok')}
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Initializes listeners for the Contact Modal and quick links
 */
export function setupFooterListeners(): void {
    const contactModal = document.getElementById('contact-modal');
    const closeContactBtn = document.getElementById('close-contact-modal');
    const legalModal = document.getElementById('legal-modal');
    const closeLegalBtn = document.getElementById('close-legal-modal');
    const legalOkBtn = document.getElementById('legal-modal-ok');
    const legalTitle = document.getElementById('legal-modal-title')?.querySelector('span');
    const legalBody = document.getElementById('legal-modal-body');

    const openContact = () => {
        contactModal?.classList.remove('hidden');
    };

    const closeContact = () => {
        contactModal?.classList.add('hidden');
    };

    const openLegal = (title: string, body: string) => {
        if (legalTitle) legalTitle.textContent = title;
        if (legalBody) legalBody.textContent = body;
        legalModal?.classList.remove('hidden');
    };

    const closeLegal = () => {
        legalModal?.classList.add('hidden');
    };

    // Close on backdrop click
    contactModal?.addEventListener('click', (e) => {
        if (e.target === contactModal) closeContact();
    });
    legalModal?.addEventListener('click', (e) => {
        if (e.target === legalModal) closeLegal();
    });

    closeContactBtn?.addEventListener('click', closeContact);
    closeLegalBtn?.addEventListener('click', closeLegal);
    legalOkBtn?.addEventListener('click', closeLegal);

    // Bind all elements with class .open-contact-modal-btn
    document.querySelectorAll('.open-contact-modal-btn').forEach(btn => {
        btn.addEventListener('click', openContact);
    });

    // Quick links
    document.getElementById('footer-link-about')?.addEventListener('click', () => {
        document.getElementById('tab-features')?.click();
    });

    document.getElementById('footer-link-faq')?.addEventListener('click', () => {
        document.getElementById('tab-home')?.click();
        setTimeout(() => {
            const faqSection = document.getElementById('faq-section');
            if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    });

    document.getElementById('footer-brand-logo')?.addEventListener('click', () => {
        document.getElementById('tab-home')?.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Legal links
    document.getElementById('footer-link-privacy')?.addEventListener('click', () => {
        openLegal(
            t('footer.privacy_modal_title'),
            t('footer.privacy_modal_desc')
        );
    });

    document.getElementById('footer-link-terms')?.addEventListener('click', () => {
        openLegal(
            t('footer.terms_modal_title'),
            t('footer.terms_modal_desc')
        );
    });

    document.getElementById('footer-link-license')?.addEventListener('click', () => {
        openLegal(
            t('footer.license_modal_title'),
            t('footer.license_modal_desc')
        );
    });
}

/**
 * Mounts the footer into the DOM container
 */
export function mountFooter(containerId: string = 'footer-container'): void {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = renderFooterHTML();
        setupFooterListeners();
        try {
            createIcons({ icons });
        } catch (_) {}
    }
}

export const Footer = renderFooterHTML;
export default Footer;
