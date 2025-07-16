import {TestBed} from '@angular/core/testing';
import {CacheStorageService, CACHE_DURATION} from './cache-storage.service';

describe('CacheStorageService', () => {
    let service: CacheStorageService;
    let CACHE_DURATION_VALUE = 1000; // 1 second for testing purposes
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CacheStorageService,
                {provide: CACHE_DURATION, useValue: CACHE_DURATION_VALUE} // 1 second for testing
            ]
        });

        service = TestBed.inject(CacheStorageService);
        sessionStorage.clear(); // Clear before each test
    });

    afterEach(() => {
        sessionStorage.clear(); // Clean up after each test
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should store and retrieve a valid item', () => {
        service.setItem('testKey', 'testValue');
        const result = service.getItem('testKey');
        expect(result).toBe(JSON.stringify('testValue'));
    });

    it('should not store existing item', () => {
        service.setItem('testKey', 'testValue');
        service.setItem('testKey', 'testValue');
        service.setItem('testKey', 'lastValue');
        const result = service.getItem('testKey');
        expect(result).toBe(JSON.stringify('lastValue'));
    });

    it('should remove item if expired', (done) => {
        service.setItem('expiredKey', 'oldValue');

        // Wait for item to expire
        setTimeout(() => {
            const result = service.getItem('expiredKey');
            expect(result).toBeNull();
            expect(sessionStorage.getItem('expiredKey')).toBeNull();
            done();
        }, CACHE_DURATION_VALUE + 1); // Wait slightly longer than 1 second
    });

    it('should return null for non-existent key', () => {
        const result = service.getItem('missingKey');
        expect(result).toBeNull();
    });

})

describe('CacheStorageService', () => {
    let service: CacheStorageService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CacheStorageService
            ]
        });

        service = TestBed.inject(CacheStorageService);
        sessionStorage.clear(); // Clear before each test
    });

    afterEach(() => {
        sessionStorage.clear(); // Clean up after each test
    });

    it('should use default cache duration if not provided', () => {
        const defaultCacheDuration = 60 * 1000 * 120; // Default to 2 hours
        expect(service.cacheDuration).toBe(defaultCacheDuration);
    })
})
