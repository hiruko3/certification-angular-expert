/**
 * This is the interface for a cache service.
 * It defines the methods that a cache service should implement.
 */
export interface CacheInterface<U> {

  /**
   * Sets an item in the cache.
   * @param key the key under which the item is stored, wathever the type
   * @param value the value to be stored, can be of any type
   */
  setItem(key: U, value: string): void;


  /**
   * Retrieves an item from the cache.
   * @param key
   */
  getItem(key: U): string | null;

}
