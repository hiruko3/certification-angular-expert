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

    /**
     * Redirects to the forecast page for the given zipcode.
     * @param zipcode
     */
    showForecast(zipcode: string) {
        this.router.navigate(['/forecast', zipcode])
    }

    /**
     * Remove location tab will trigger the removeLocation output event.
     * @param id
     */
    onRemoveLocationTab(id: T) {
        this.removeLocation.emit(id);
    }


}
