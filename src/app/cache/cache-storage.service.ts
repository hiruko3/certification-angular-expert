import {inject, Injectable, InjectionToken} from '@angular/core';
import {CacheInterface} from './cache.interface';
import {CacheEntry} from './cache-entry';

// This is the duration in seconds for which the cache will be valid.
export const CACHE_DURATION = new InjectionToken<number>('CacheDuration');

@Injectable({
    providedIn: 'root'
})
export class CacheStorageService implements CacheInterface<string> {

    readonly cacheDuration: number = inject(CACHE_DURATION, {optional: true}) || 60 * 1000 * 120; // Default to 2 hours

    /**
     * Sets an item in the cache with sessionStorage.
     * It stringifies the value before storing it.
     * @param key
     * @param value
     */
    setItem<T>(key: string, value: T): void {
        const cacheEntry: CacheEntry<T> = {
            value: value,
            timeStamp: Date.now() // Store the current timestamp
        };
        sessionStorage.setItem(key, JSON.stringify(cacheEntry));
    }

    /**
     * Retrieves an item from the cache with sessionStorage.
     * It checks if the item is still valid based on the cache duration.
     * If the item is expired, it removes it from the cache.
     * If the item is valid, it returns the stringified value.
     * @returns the stringified value of the cached item or null if it is not found or expired.
     * @param key the key under which the item is stored
     */
    getItem(key: string): string {
        let item: string | null = null;
        const cacheEntryString = sessionStorage.getItem(key);
        if (cacheEntryString) {
            const cacheEntry: CacheEntry<any> = JSON.parse(cacheEntryString);
            const currentTime = Date.now();

            // Check if the cache entry is still valid
            if (currentTime - cacheEntry.timeStamp > this.cacheDuration) {
                sessionStorage.removeItem(key); // Remove expired item
            } else {
                item = JSON.stringify(cacheEntry.value); // Return the cached value
            }
        }
        return item;
    }
}
