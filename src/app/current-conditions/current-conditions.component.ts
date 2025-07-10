import {ChangeDetectionStrategy, Component, inject, input, output, OutputEmitterRef, Signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {DecimalPipe} from '@angular/common';
import {TabsComponent} from '../tabs/tabs.component';
import {TabComponent} from '../tabs/tab/tab.component';

@Component({
    selector: 'app-current-conditions',
    templateUrl: './current-conditions.component.html',
    styleUrls: ['./current-conditions.component.css'],
    standalone: true,
    imports: [
        TabsComponent,
        RouterLink,
        DecimalPipe,
        TabComponent,

    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsComponent<T> {

    /**
     * Remove location output event
     */
    removeLocation: OutputEmitterRef<T> = output();

    /**
     * Represents the current conditions by zip code.
     * InputSignal is used to ensure that the component can receive data from its parent component.
     */
    currentConditionsByZip: Signal<ConditionsAndZip[]> = input.required();

    private router = inject(Router);

    showForecast(zipcode: string) {
        this.router.navigate(['/forecast', zipcode])
    }

    /**
     * Emit the zipCode to removeLocation.
     * @param zipCode
     */
    selectedLocation(zipCode: T) {
        this.removeLocation.emit(zipCode);
    }

    onRemoveLocationTab(id: T) {
        this.removeLocation.emit(id);
    }
    onRemoveLocation(obj : T) {
        console.log(obj)
    }

}
