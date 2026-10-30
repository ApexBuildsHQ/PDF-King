/**
 * Direct Link & Ads Configuration for PDF King
 * 
 * Configured to open ONLY when clicking the processing button (Merge, Split, Compress, etc.)
 * in a SINGLE tab, with ZERO interference to the automatic file download.
 */
export const DIRECT_AD_LINK = 'https://othentigo.com/4/8664448';

export const ADS_CONFIG = {
    // Direct Ad URL
    url: DIRECT_AD_LINK,
    // Open ONLY on tool processing button click
    triggerOnProcess: true,
    // Do NOT trigger on download (downloads remain purely automatic)
    triggerOnDownload: false,
};
