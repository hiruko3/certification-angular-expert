import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {LocationService} from '../location.service';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {CurrentConditionsComponent} from '../current-conditions/current-conditions.component';
import {ZipcodeEntryComponent} from '../zipcode-entry/zipcode-entry.component';
import {JsonPipe} from '@angular/common';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    standalone: true,
    imports: [ZipcodeEntryComponent, CurrentConditionsComponent, JsonPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {

    /**
     * Represents the list of location.
     * Readonly to prevent direct modification of the location array.
     * The behavior is managed by the location service.
     */
    readonly locations: Signal<string[]>;

    /**
     * The conditions for the locations.
     */
    readonly conditions: Signal<ConditionsAndZip[]>;

    locationService: LocationService = inject(LocationService);
    weatherService: WeatherService = inject(WeatherService);

    /**
     * We use the constructor to initialize the locations and conditions.
     */
    constructor() {
        this.locations = this.locationService.getLocations();
        this.conditions = this.weatherService.getCurrentConditions();

        /**
         * We don't want to use the effect here, as we want to initialize the current conditions based on the locations initialized in the location service.
         */
        this.locations().forEach((zipCode: string) => {
            if (!this.conditions().some(condition => condition.zip === zipCode)) {
                this.weatherService.addCurrentConditions(zipCode);
            }
        })
    }

    /**
     * Add a location to the location service.
     * This is handled by the parent container component, not the child component as its behavior is to stay dumb.
     * @param zipCode
     */
    addLocationSelected(zipCode: string): void {
        this.locationService.addLocation(zipCode);
        this.weatherService.addCurrentConditions(zipCode);
    }

    /**
     * Remove a location from the location service.
     * @param zipCode
     */
    removeLocationSelected(zipCode: string): void {
        this.locationService.removeLocation(zipCode);
    }

    /**
     *
     */

}
