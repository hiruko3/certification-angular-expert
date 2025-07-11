import {Injectable, Signal, signal, WritableSignal} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {CacheStorageService} from './cache/cache-storage.service';
import {CONDITION_CACHE_SUFFIX, FORECAST_CACHE_SUFFIX} from './constants';

/**
 * This service handles the interaction with the OpenWeatherMap API to fetch current weather conditions and forecasts.
 * It is a black box that abstracts the details of the API calls and provides a simple interface for components to get weather data.
 */
@Injectable()
export class WeatherService {

    static URL = 'https://api.openweathermap.org/data/2.5';
    static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
    static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

    private currentConditions: WritableSignal<ConditionsAndZip[]> = signal<ConditionsAndZip[]>([]);
    private currentForecast: WritableSignal<Forecast | null> = signal<Forecast>(null);

    constructor(private http: HttpClient, private cacheService: CacheStorageService) {
    }

    addCurrentConditions(zipcode: string): void {
        // Check if the condition already exists in the cache
        const key: string = zipcode + CONDITION_CACHE_SUFFIX;
        const cachedConditions: string = this.cacheService.getItem(key);
        if (cachedConditions) {
            const conditionAndZip: CurrentConditions = JSON.parse(cachedConditions);
            this.updateConditions(zipcode, conditionAndZip);
        } else {
            // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
            this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
                .subscribe((data: CurrentConditions): void => {
                    this.updateConditions(zipcode, data);
                    this.cacheService.setItem(key, data); // Store the current conditions in the cache
                });
        }
    }

    /**
     * Update the current conditions with the new data.
     * @param zipcode the zipcode for which the conditions are being updated
     * @param data the current conditions data
     * @private
     */
    private updateConditions(zipcode: string, data: CurrentConditions): void {
        this.currentConditions.update((conditions: ConditionsAndZip[]): ConditionsAndZip[] => [...conditions, {
            zip: zipcode,
            data,
            icon: this.getWeatherIcon(data.weather[0].id)
        }]);
    }

    removeCondition(zipCode: string) {
        this.currentConditions.update((conditions: ConditionsAndZip[]): ConditionsAndZip[] => {
            const index: number = conditions.indexOf(conditions.find(condition => condition.zip === zipCode));
            conditions.splice(index, 1);
            return conditions;
        });
    }

    getCurrentConditions(): Signal<ConditionsAndZip[]> {
        return this.currentConditions.asReadonly();
    }

    /**
     * Fetches the current weather conditions for a given zipcode.
     * @param zipcode
     */
    computeForecast(zipcode: string): void {
        const key: string = zipcode + FORECAST_CACHE_SUFFIX;
        const cachedForecast: string = this.cacheService.getItem(key);
        if (cachedForecast) {
            this.currentForecast.set(JSON.parse(cachedForecast));
        } else {
            this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`).subscribe((data: Forecast): void => {
                this.currentForecast.set(data);
                // Cache the forecast data
                this.cacheService.setItem(key, data);
            })
        }

    }

    /**
     * Returns the current weather forecast for a given zipcode as a readonly Signal.
     */
    getForecast(): Signal<Forecast | null> {
        return this.currentForecast.asReadonly();
    }


    getWeatherIcon(id): string {
        if (id >= 200 && id <= 232) {
            return WeatherService.ICON_URL + 'art_storm.png';
        } else if (id >= 501 && id <= 511) {
            return WeatherService.ICON_URL + 'art_rain.png';
        } else if (id === 500 || (id >= 520 && id <= 531)) {
            return WeatherService.ICON_URL + 'art_light_rain.png';
        } else if (id >= 600 && id <= 622) {
            return WeatherService.ICON_URL + 'art_snow.png';
        } else if (id >= 801 && id <= 804) {
            return WeatherService.ICON_URL + 'art_clouds.png';
        } else if (id === 741 || id === 761) {
            return WeatherService.ICON_URL + 'art_fog.png';
        } else {
            return WeatherService.ICON_URL + 'art_clear.png';
        }
    }

}
