import {Component, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Forecast} from './forecast.type';
import {DatePipe, DecimalPipe, NgFor} from '@angular/common';

@Component({
    selector: 'app-forecasts-list',
    templateUrl: './forecasts-list.component.html',
    styleUrls: ['./forecasts-list.component.css'],
    standalone: true,
    imports: [NgFor, RouterLink, DecimalPipe, DatePipe]
})
export class ForecastsListComponent {

    /**
     * The zipcode for which the forecast is being displayed.
     */
    zipcode: string;

    /**
     * Signal that holds the forecast data for the specified zipcode.
     */
    forecast: Signal<Forecast>;

    /**
     * ForecastsListComponent is responsible for displaying the weather forecast for a specific zipcode.
     * @param weatherService
     * @param route
     */
    constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
        route.params.subscribe(params => {
            this.zipcode = params['zipcode'];
            this.weatherService.computeForecast(this.zipcode);
        });
        this.forecast = this.weatherService.getForecast();
    }
}
