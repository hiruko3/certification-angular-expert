import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {LocationService} from '../location.service';
import {WeatherService} from '../weather.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {CurrentConditionsComponent} from '../current-conditions/current-conditions.component';
import {ZipcodeEntryComponent} from '../zipcode-entry/zipcode-entry.component';
import {createFrequencyMap} from '../utils/utils';

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

        // We sync the current conditions with the locations.
        if (this.conditions().length > 0) {
            // count occurence of each zip code in the conditions
            const frequencyLocation: Map<string, number> = createFrequencyMap(this.locations());
            const frequencyCondition: Map<string, number> = createFrequencyMap(this.conditions().map((condition: ConditionsAndZip): string => condition.zip));

            // If the frequency of the condition is greater than the frequency of the location, we remove the condition.
            frequencyCondition.forEach((key: number, value: string) => {
                const diffBetweenConditionAndLocation = (frequencyCondition.get(value) || 0) - (frequencyLocation.get(value) || 0);
                if (diffBetweenConditionAndLocation > 0) {
                    for (let i = 0; i < diffBetweenConditionAndLocation; i++) {
                        this.weatherService.removeCondition(value)
                    }
                }
            })
        }
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
     * Remove the current conditions for the location as well.
     * We keep the current logic that keeps the locations but removing all conditions associated with the location.
     * @param zipCode
     */
    removeLocationSelected(zipCode: string): void {
        this.locationService.removeLocation(zipCode);
    }
}
