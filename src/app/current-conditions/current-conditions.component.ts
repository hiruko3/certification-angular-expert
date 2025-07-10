import {Component, inject, OutputEmitterRef, Signal, output, input} from '@angular/core';
import {WeatherService} from '../weather.service';
import {Router} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  /**
   * Remove location output event
   */
  removeLocation: OutputEmitterRef<string> = output();

  /**
   * Represents the current conditions by zip code.
   * InputSignal is used to ensure that the component can receive data from its parent component.
   */
  readonly currentConditionsByZip: Signal<ConditionsAndZip[]> = input.required();

  private router = inject(Router);

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  /**
   * Emit the zipCode to removeLocation.
   * @param zipCode
   */
  selectedLocation(zipCode: string) {
    this.removeLocation.emit(zipCode);
  }
}
