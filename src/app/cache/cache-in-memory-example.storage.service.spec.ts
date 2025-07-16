import {TestBed} from '@angular/core/testing';

import {CACHE_DURATION, CacheStorageService} from './cache-storage.service';
import {CacheInterface} from './cache.interface';
import {Inject, Injectable} from '@angular/core';

describe('CacheStorageService', () => {
    let service: CacheMemoryStorageService<string>;
    let CACHE_DURATION_VALUE = 1000 * 1; // 1 second for testing purposes
    @Injectable({
        providedIn: 'root'
    })
    class CacheMemoryStorageService<T> implements CacheInterface<T> {

        memoryCache: Map<T, string> = new Map<T, string>();

        constructor(@Inject(CACHE_DURATION) readonly cacheDuration: number) {
        }

        setItem(key: T, value: string): void {
            const cacheEntry = {
                value: value,
                timeStamp: Date.now() // Store the current timestamp
            }

            this.memoryCache.set(key, JSON.stringify(cacheEntry));
        }

        getItem(key: T): string | null {
            if(this.memoryCache.has(key)) {
                const cacheEntryString: string = this.memoryCache.get(key) as string;
                const cacheEntry: { value: string, timeStamp: number } = JSON.parse(cacheEntryString);
                const currentTime: number = Date.now();

                // Check if the cache entry is still valid based on the cache duration
                if (currentTime - cacheEntry.timeStamp > this.cacheDuration) { // Assuming 10 seconds for testing
                    this.memoryCache.delete(key); // Remove expired item
                    return null;
                } else {
                    return cacheEntry.value; // Return the cached value
                }
            } else {
                return null;
            }
        }

        getMemoryCache(): Map<T, string> {
            return this.memoryCache;
        }

    }

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [{
                provide: CacheStorageService,
                useClass: CacheMemoryStorageService
            },
                {
                    provide: CACHE_DURATION,
                    useValue: CACHE_DURATION_VALUE // 10 seconds for testing purposes
                }
            ]
        });

        service = TestBed.inject(CacheMemoryStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    function addValue(key: string, value: string) {
        service.setItem(key, value);
    }

    it('should set item when key is not present', () => {
        addValue('testKey', 'testValue');
        expect(service.getMemoryCache()).toHaveSize(1);
    })

    it('should not set an item when key is already present', () => {
        addValue('testKey', 'testValue');
        addValue('testKey', 'testValue');
        expect(service.getMemoryCache()).toHaveSize(1);
    })


    it('should get item when key is present', () => {
        addValue('keyAdded', 'testValue');
        const itemCached = service.getItem('keyAdded');
        expect(itemCached).not.toBeNull();
        expect(itemCached).toEqual("testValue");
    })

    it('should return null when key is not present', () => {
        const itemCached = service.getItem('nonExistentKey');
        expect(itemCached).toBeNull();
    });

    it('should return null when key is present but expired', (done: DoneFn): void => {
        addValue('expiredKey', 'testValue');
        setTimeout(() => {
            const itemCached = service.getItem('expiredKey');
            expect(itemCached).toBeNull();
            done();
        }, CACHE_DURATION_VALUE + 1); // Wait for 1 second to ensure the cache entry is expired
    })
});
