import {Component, output, OutputEmitterRef} from '@angular/core';
import {LocationService} from "../location.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  /**
   * Emit the zipCode to addLocation to the location service.
   */
  addLocation: OutputEmitterRef<string> = output();

  constructor(private service : LocationService) { }

  /**
   * Select a location by zipcode.
   * @param zipcode the zipcode selected by the user
   */
  selectLocation(zipcode : string){
    this.addLocation.emit(zipcode)
  }

}
