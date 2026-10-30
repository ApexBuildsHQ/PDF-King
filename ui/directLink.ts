/**
 * Direct Link / Ad Trigger Utility for PDF King
 * Opens direct ad link in a SINGLE tab strictly when users click the tool processing button,
 * then freezes (cooldown) for 5 minutes before it can be triggered again.
 */
import { ADS_CONFIG } from '../config/ads.js';

// Cooldown interval: 5 minutes in milliseconds
const COOLDOWN_INTERVAL_MS = 5 * 60 * 1000;

export const getLastTriggerTime = (): number => {
    try {
        const stored = localStorage.getItem('pdfking_ad_last_trigger');
        if (stored) {
            const time = parseInt(stored, 10);
            if (!isNaN(time)) return time;
        }
    } catch {
        // ignore
    }
    return 0;
};

export const setLastTriggerTime = (time: number): void => {
    try {
        localStorage.setItem('pdfking_ad_last_trigger', time.toString());
    } catch {
        // ignore
    }
};

export const getDirectLinkUrl = (): string => {
    try {
        const customUrl = localStorage.getItem('pdfking_direct_link');
        if (customUrl && customUrl.trim()) return customUrl.trim();
    } catch {
        // ignore
    }
    return (window as any).DIRECT_AD_LINK || ADS_CONFIG.url || '';
};

/**
 * Triggers the direct ad link in a single new tab immediately on process button click,
 * and enters a 5-minute freeze period before allowing another trigger.
 * @param eventType 'process' when user clicks the processing or history redownload button
 */
export const triggerDirectLink = (eventType: 'process' | 'download'): boolean => {
    // Only trigger on process button click, never on download
    if (eventType !== 'process' || !ADS_CONFIG.triggerOnProcess) {
        return false;
    }

    const url = getDirectLinkUrl();
    if (!url) {
        return false;
    }

    const now = Date.now();
    const lastTrigger = getLastTriggerTime();

    // Check if 5 minutes have elapsed since the last trigger
    if (now - lastTrigger < COOLDOWN_INTERVAL_MS) {
        // Still frozen inside the 5-minute window
        return false;
    }

    // Set new trigger time for the next 5-minute cooldown
    setLastTriggerTime(now);

    try {
        // Open exactly one tab safely
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
        }, 150);
        return true;
    } catch (e) {
        console.warn('Ad link notice:', e);
        return false;
    }
};

// Global inspection/customization
if (typeof window !== 'undefined') {
    (window as any).PDFKingAds = {
        config: ADS_CONFIG,
        getUrl: getDirectLinkUrl,
        setUrl: (newUrl: string) => {
            ADS_CONFIG.url = newUrl;
            try { localStorage.setItem('pdfking_direct_link', newUrl); } catch {}
        },
        trigger: triggerDirectLink,
        getLastTriggerTime,
        cooldownRemainingMs: () => {
            const diff = Date.now() - getLastTriggerTime();
            return Math.max(0, COOLDOWN_INTERVAL_MS - diff);
        }
    };
}
