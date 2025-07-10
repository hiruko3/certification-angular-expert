import {Component, inject} from '@angular/core';
import {LocationService} from '../location.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {

  locationService: LocationService = inject(LocationService);

  /**
   * Add a location to the location service.
   * This is handled by the parent container component, not the child component as its behavior is to stay dumb.
   * @param zipCode
   */
  onLocationSelected(zipCode: string) : void {
    this.locationService.addLocation(zipCode);
  }
}
