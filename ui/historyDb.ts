/**
 * IndexedDB storage for PDF King processed files and history records.
 * Stores generated Blob files locally so users can re-download them from History.
 * Automatically evicts the oldest records when storage space is full to ensure
 * the latest operation can always be stored.
 */

export interface ProcessedHistoryItem {
    id: string;
    toolId: string;
    toolName: string;
    fileName: string;
    fileSize: number;
    timestamp: number;
    blob: Blob;
}

const DB_NAME = 'PDFKingDB';
const DB_VERSION = 1;
const STORE_NAME = 'processed_files';
const MAX_RECORDS = 30; // Limit saved records to prevent excessive storage usage

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Deletes the oldest N records from IndexedDB to free up storage space.
 */
export async function deleteOldestRecords(db: IDBDatabase, countToDelete: number): Promise<number> {
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const index = store.index('timestamp');
            const cursorReq = index.openCursor(null, 'next'); // oldest records first
            let deletedCount = 0;

            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result;
                if (cursor && deletedCount < countToDelete) {
                    cursor.delete();
                    deletedCount++;
                    cursor.continue();
                } else {
                    resolve(deletedCount);
                }
            };
            cursorReq.onerror = () => resolve(deletedCount);
            tx.oncomplete = () => resolve(deletedCount);
            tx.onerror = () => resolve(deletedCount);
        } catch {
            resolve(0);
        }
    });
}

/**
 * Saves a processed file to IndexedDB for offline history and re-download capability.
 * If storage quota is exceeded or storage is full, it automatically deletes the oldest
 * processed files to make room for the latest file.
 */
export async function saveProcessedFileRecord(
    toolId: string,
    toolName: string,
    fileName: string,
    blob: Blob
): Promise<void> {
    const record: ProcessedHistoryItem = {
        id: 'pk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        toolId: toolId || 'pdf-tool',
        toolName: toolName || 'PDF Tool',
        fileName: fileName || 'document.pdf',
        fileSize: blob.size || 0,
        timestamp: Date.now(),
        blob: blob
    };

    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // Proactively check storage estimate if supported by the browser
            if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
                try {
                    const estimate = await navigator.storage.estimate();
                    if (estimate.quota && estimate.usage) {
                        const remaining = estimate.quota - estimate.usage;
                        // If remaining space is tight (less than blob size + 10MB safety margin)
                        if (remaining < blob.size + 10 * 1024 * 1024) {
                            const db = await openDB();
                            await deleteOldestRecords(db, 2);
                        }
                    }
                } catch {
                    // estimate check is optional, ignore failures
                }
            }

            const db = await openDB();

            await new Promise<void>((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);

                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
                tx.onabort = () => reject(tx.error);

                store.put(record);

                // Auto-prune beyond MAX_RECORDS to keep history tidy
                const countReq = store.count();
                countReq.onsuccess = () => {
                    if (countReq.result > MAX_RECORDS) {
                        const index = store.index('timestamp');
                        const cursorReq = index.openCursor(null, 'next'); // oldest first
                        let excess = countReq.result - MAX_RECORDS;
                        cursorReq.onsuccess = () => {
                            const cursor = cursorReq.result;
                            if (cursor && excess > 0) {
                                cursor.delete();
                                excess--;
                                cursor.continue();
                            }
                        };
                    }
                };
            });

            // Write succeeded!
            return;
        } catch (err: any) {
            console.warn(`IndexedDB save attempt ${attempt + 1} failed:`, err);
            // Storage quota exceeded or error occurred:
            // Delete the oldest record(s) to free up space and retry
            try {
                const db = await openDB();
                const freed = await deleteOldestRecords(db, 2);
                if (freed === 0) {
                    // No more older records to delete
                    break;
                }
            } catch {
                break;
            }
        }
    }
}

/**
 * Retrieves all stored history items ordered by newest first.
 */
export async function getAllHistoryRecords(): Promise<ProcessedHistoryItem[]> {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('timestamp');
        const request = index.getAll();

        const records = await new Promise<ProcessedHistoryItem[]>((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });

        return records.sort((a, b) => b.timestamp - a.timestamp);
    } catch (err) {
        console.warn('IndexedDB getAll failed:', err);
        return [];
    }
}

/**
 * Deletes a single history record by ID.
 */
export async function deleteHistoryRecord(id: string): Promise<void> {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.warn('IndexedDB delete failed:', err);
    }
}
