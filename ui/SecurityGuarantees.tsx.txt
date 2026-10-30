/**
 * SecurityGuarantees Component
 * Clarifies local, 100% client-side privacy guarantees and global compliance (GDPR, CCPA, HIPAA).
 * Fully localized with real-time t() bindings and data-i18n attributes.
 */

import { t } from '../js/i18n.js';
import { icons, createIcons } from 'lucide';

export function renderSecurityGuaranteesHTML(): string {
    return `
    <section id="security-guarantees" class="w-full max-w-4xl mx-auto my-8 px-4 sm:px-0">
        <div class="tool-card relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border shadow-sm">
            <!-- Ambient Glow Effect -->
            <div class="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Header with Shield Icon -->
            <div class="text-center max-w-2xl mx-auto mb-8 relative z-10">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                    <i data-lucide="shield-check" class="w-8 h-8"></i>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 hero-title" data-i18n="security.main_title">
                    ${t('security.main_title')}
                </h2>
                <p class="text-sm sm:text-base font-medium hero-subtitle max-w-xl mx-auto" data-i18n="security.sub_title">
                    ${t('security.sub_title')}
                </p>
            </div>

            <!-- 3 Badges Grid (1 column on mobile, 3 columns on large screens) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
                <!-- GDPR Compliance Card -->
                <div class="p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/80 hover:border-emerald-500/30 transition-all flex flex-col items-center text-center group">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <i data-lucide="lock" class="w-6 h-6"></i>
                    </div>
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2" data-i18n="security.badge_eu">
                        ${t('security.badge_eu')}
                    </span>
                    <h3 class="text-base sm:text-lg font-bold mb-1 text-gray-900 dark:text-white" data-i18n="security.gdpr_title">
                        ${t('security.gdpr_title')}
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed" data-i18n="security.gdpr_desc">
                        ${t('security.gdpr_desc')}
                    </p>
                </div>

                <!-- CCPA Compliance Card -->
                <div class="p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/80 hover:border-amber-500/30 transition-all flex flex-col items-center text-center group">
                    <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <i data-lucide="user-check" class="w-6 h-6"></i>
                    </div>
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2" data-i18n="security.badge_ca">
                        ${t('security.badge_ca')}
                    </span>
                    <h3 class="text-base sm:text-lg font-bold mb-1 text-gray-900 dark:text-white" data-i18n="security.ccpa_title">
                        ${t('security.ccpa_title')}
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed" data-i18n="security.ccpa_desc">
                        ${t('security.ccpa_desc')}
                    </p>
                </div>

                <!-- HIPAA Compliance Card -->
                <div class="p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/80 hover:border-emerald-500/30 transition-all flex flex-col items-center text-center group">
                    <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <i data-lucide="heart-pulse" class="w-6 h-6"></i>
                    </div>
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2" data-i18n="security.badge_health">
                        ${t('security.badge_health')}
                    </span>
                    <h3 class="text-base sm:text-lg font-bold mb-1 text-gray-900 dark:text-white" data-i18n="security.hipaa_title">
                        ${t('security.hipaa_title')}
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed" data-i18n="security.hipaa_desc">
                        ${t('security.hipaa_desc')}
                    </p>
                </div>
            </div>
        </div>
    </section>
    `;
}

export function mountSecurityGuarantees(containerId: string = 'security-guarantees-container'): void {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = renderSecurityGuaranteesHTML();
        try {
            createIcons({ icons });
        } catch (_) {}
    }
}

export const SecurityGuarantees = renderSecurityGuaranteesHTML;

export default SecurityGuarantees;
