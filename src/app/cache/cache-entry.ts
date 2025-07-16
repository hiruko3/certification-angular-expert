/**
 * CacheEntry interface represents a single entry in the cache.
 *
 */
export interface CacheEntry<T> {

    /**
     * The value stored in the cache entry.
     * This can be of any type, allowing flexibility in what can be cached.
     */
    value: T;

    /**
     * Metadata about the cache entry.
     * This represents the time when the entry was created or last updated.
     */
    timeStamp: number; //in milliseconds since epoch

}
