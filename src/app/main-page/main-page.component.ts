import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {LocationService} from '../location.service';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {CurrentConditionsComponent} from '../current-conditions/current-conditions.component';
import {ZipcodeEntryComponent} from '../zipcode-entry/zipcode-entry.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    standalone: true,
    imports: [ZipcodeEntryComponent, CurrentConditionsComponent],
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


        // We don't want to use the effect here, as we want to initialize the current conditions based on the locations initialized in the location service.

        this.locations().forEach((zipCode: string) => {
            // Check if the current conditions for the zip code already exist
            if (!this.conditions().some(condition => condition.zip === zipCode)) {
                this.weatherService.addCurrentConditions(zipCode);
            }
        })

        // if (this.conditions().length > 0) {
        //
        //     // count occurence of each zip code in the conditions
        //     const frequencyLocation: Map<string, number> = new Map<string, number>();
        //     for (let location of this.locations()) {
        //         if (frequencyLocation.get(location)) {
        //             const occurence = frequencyLocation.get(location);
        //             frequencyLocation.set(location, occurence + 1);
        //         } else {
        //             frequencyLocation.set(location, 1);
        //         }
        //     }
        //
        //     const frequencyCondition: Map<string, number> = new Map<string, number>();
        //     for (let condition of this.conditions()) {
        //         if (frequencyCondition.get(condition.zip)) {
        //             const occurence = frequencyCondition.get(condition.zip);
        //             frequencyCondition.set(condition.zip, occurence + 1);
        //         } else {
        //             frequencyCondition.set(condition.zip, 1);
        //         }
        //     }
        //
        //     this.conditions().forEach((condition: ConditionsAndZip) => {
        //         const diffBetweenConditionAndLocation = (frequencyCondition.get(condition.zip) || 0) - (frequencyLocation.get(condition.zip) || 0);
        //         if (diffBetweenConditionAndLocation > 0) {
        //             for (let i = 0; i < diffBetweenConditionAndLocation; i++) {
        //                 this.weatherService.removeCurrentConditions(condition.zip)
        //             }
        //         }
        //     })
        // }


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
        this.weatherService.removeCurrentConditions(zipCode);
    }

    /**
     *
     */

}
