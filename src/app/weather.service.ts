import {Injectable, Signal, signal} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {CacheStorageService} from './cache/cache-storage.service';

@Injectable()
export class WeatherService {

    static URL = 'https://api.openweathermap.org/data/2.5';
    static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
    static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

    private currentConditions = signal<ConditionsAndZip[]>([]);

    constructor(private http: HttpClient, private cacheService: CacheStorageService) {
    }

    addCurrentConditions(zipcode: string): void {
        // Check if the condition already exists in the cache
        const cachedConditions: string = this.cacheService.getItem(zipcode);
        if(cachedConditions) {
            const conditionAndZip: CurrentConditions = JSON.parse(cachedConditions);
            this.updateConditions(zipcode, conditionAndZip);
        } else {
            // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
            this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
                .subscribe((data: CurrentConditions): void => {
                    this.updateConditions(zipcode, data);
                    this.cacheService.setItem(zipcode, data); // Store the current conditions in the cache
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
            conditions.splice(index,1);
            return conditions;
        });
    }

    getCurrentConditions(): Signal<ConditionsAndZip[]> {
        return this.currentConditions.asReadonly();
    }

    getForecast(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);

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
            return WeatherService.ICON_URL + "art_fog.png";
        } else {
            return WeatherService.ICON_URL + "art_clear.png";
        }
    }

}
