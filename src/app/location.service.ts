import {Injectable, Signal, signal, WritableSignal} from '@angular/core';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {

    /**
     * Signal to hold the list of locations.
     * @private to prevent direct modification of the location array.
     */
    private locations: WritableSignal<string[]> = signal<string[]>([]);

    /**
     * Method that returns a readonly signal of locations.
     */
    getLocations(): Signal<string[]> {
        return this.locations.asReadonly();
    }

    /**
     * Here we add the location stored in localStorage to locations signal.
     */
    constructor() {
        let locString = localStorage.getItem(LOCATIONS);
        if (locString) {
            this.locations.set(JSON.parse(locString));
        }
    }

    /**
     * Add location to locations signal and update localStorage.
     * @param zipcode
     */
    addLocation(zipcode: string) {
        this.locations.update((): string[] => [...this.locations(), zipcode]);
        localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
    }

    /**
     * Remove location from locations signal and update localStorage.
     * @param zipcode
     */
    removeLocation(zipcode: string) {
        let index = this.locations().indexOf(zipcode);
        if (index !== -1) {
            console.log(`Removing location: ${zipcode} at index ${index}`);
            this.locations.update((): string[] => {
                const locations = [...this.locations()];
                locations.splice(index, 1)
                localStorage.setItem(LOCATIONS, JSON.stringify(locations));
                return locations;
            });
        }
    }
}
