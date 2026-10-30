/**
 * FAQSection Component
 * Frequently Asked Questions accordion and Schema.org FAQPage JSON-LD rich snippet generator.
 */

import { t } from '../js/i18n.js';
import { icons, createIcons } from 'lucide';

export function renderFAQSectionHTML(): string {
    return `
    <section id="faq-section" class="max-w-4xl mx-auto my-12 px-4 sm:px-0">
        <div class="text-center max-w-2xl mx-auto mb-8">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3" data-i18n="faq.badge">
                ${t('faq.badge')}
            </span>
            <h2 class="hero-title text-2xl sm:text-3xl font-black mb-2" data-i18n="faq.title">
                ${t('faq.title')}
            </h2>
            <p class="hero-subtitle text-sm sm:text-base" data-i18n="faq.subtitle">
                ${t('faq.subtitle')}
            </p>
        </div>

        <div class="space-y-4 max-w-3xl mx-auto">
            <!-- Question 1 -->
            <details class="group tool-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none">
                    <span data-i18n="faq.q1_title">${t('faq.q1_title')}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3" data-i18n="faq.q1_ans">
                    ${t('faq.q1_ans')}
                </p>
            </details>

            <!-- Question 2 -->
            <details class="group tool-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none">
                    <span data-i18n="faq.q2_title">${t('faq.q2_title')}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3" data-i18n="faq.q2_ans">
                    ${t('faq.q2_ans')}
                </p>
            </details>

            <!-- Question 3 -->
            <details class="group tool-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none">
                    <span data-i18n="faq.q3_title">${t('faq.q3_title')}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3" data-i18n="faq.q3_ans">
                    ${t('faq.q3_ans')}
                </p>
            </details>

            <!-- Question 4 -->
            <details class="group tool-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none">
                    <span data-i18n="faq.q4_title">${t('faq.q4_title')}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3" data-i18n="faq.q4_ans">
                    ${t('faq.q4_ans')}
                </p>
            </details>

            <!-- Question 5 -->
            <details class="group tool-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none">
                    <span data-i18n="faq.q5_title">${t('faq.q5_title')}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3" data-i18n="faq.q5_ans">
                    ${t('faq.q5_ans')}
                </p>
            </details>

            <!-- Question 6 -->
            <details class="group tool-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none">
                    <span data-i18n="faq.q6_title">${t('faq.q6_title')}</span>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3" data-i18n="faq.q6_ans">
                    ${t('faq.q6_ans')}
                </p>
            </details>
        </div>
    </section>
    `;
}

/**
 * Injects or updates Schema.org FAQPage JSON-LD structured data in document head
 */
export function updateFAQSchema(): void {
    const questions = [
        { q: t('faq.q1_title'), a: t('faq.q1_ans') },
        { q: t('faq.q2_title'), a: t('faq.q2_ans') },
        { q: t('faq.q3_title'), a: t('faq.q3_ans') },
        { q: t('faq.q4_title'), a: t('faq.q4_ans') },
        { q: t('faq.q5_title'), a: t('faq.q5_ans') },
        { q: t('faq.q6_title'), a: t('faq.q6_ans') }
    ];

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': questions.map(item => ({
            '@type': 'Question',
            'name': item.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.a
            }
        }))
    };

    let scriptEl = document.getElementById('faq-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'faq-schema-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaData, null, 2);
}

/**
 * Mounts the FAQ Section into the DOM and initializes Schema JSON-LD
 */
export function mountFAQSection(containerId: string = 'faq-section-container'): void {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = renderFAQSectionHTML();
        try {
            createIcons({ icons });
        } catch (_) {}
    }
    updateFAQSchema();
}

export const FAQSection = renderFAQSectionHTML;
export default FAQSection;
