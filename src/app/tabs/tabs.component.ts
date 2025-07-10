import {ChangeDetectionStrategy, Component, contentChildren, effect, output, OutputEmitterRef, Signal, ElementRef} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {MyButtonDirective} from './directive/my-button.directive';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [
        MyButtonDirective,
        NgClass
    ],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * TabsComponent is a container for multiple TabComponent instances.
 * @example
 * <app-tabs>
 *     <app-tab label="Tab 1">Content for Tab 1</app-tab>
 *     <app-tab label="Tab 2">Content for Tab 2</app-tab>
 *     <app-tab label="Tab 3">Content for Tab 3</app-tab>
 * </app-tabs>
 */
export class TabsComponent<T> {

    readonly tabElements: Signal<readonly TabComponent<T>[]> | undefined = contentChildren<TabComponent<T>>(TabComponent);

    readonly onCloseTab: OutputEmitterRef<T> = output<T>();

    constructor() {
        effect(() => {
            const tabs: readonly TabComponent<T>[] = this.tabElements();
            if (tabs && tabs.length > 0) {
                // Set the first tab as active by default
                if (!tabs.some((tab) => tab.isActive)) {
                    const firstTabVisible = this.tabElements().find(tab => tab.isVisible);
                    firstTabVisible.isActive = true;
                    firstTabVisible.forceRendering();
                }
            }
        })
    }


    selectTab(tab: TabComponent<T>): void {
        const tabs: readonly TabComponent<T>[] = this.tabElements();
        this.deactivateTab();
        tabs[tabs.indexOf(tab)].isActive = true;
    }

    /**
     * Hide a tab instead of removing it from the DOM.
     * It will hide the tab and emit an event to handle the logic outside of the component.
     * We activate the first tab if the removed tab was active, else we stay on the current active tab.
     * @param tabToHide the tab to hide
     */
    removeTab(tabToHide: TabComponent<T>): void {
        this.hideTab(tabToHide)
        // only activate a new tab if the tab to hide is active
        if(tabToHide.isActive) {
            this.deactivateTab();
            this.activateFirstVisibleTab();
        }
    }

    /**
     * We hide the tab instead of removing it from the DOM.
     * emit the onCloseTab event to handle the logic outside of the component.
     * @param tabToHide the tab to hide
     */
    hideTab(tabToHide: TabComponent<T>): void {
        // hide the tab instead of removing it from the DOM
        tabToHide.isVisible = false;
        this.onCloseTab.emit(tabToHide.id());
    }

    /**
     * Deactivate all tabs.
     */
    deactivateTab(): void {
        this.tabElements().forEach((tab) => {
            // Deactivate all tabs
            tab.isActive = false;
        })
    }

    /**
     * Activate the first visible tab if the removed tab was active.
     * If no tab is visible, no tab will be activated.
     */
    activateFirstVisibleTab(): void {
        //Activate the first visible tab if the removed tab was active
        const tabToActivate = this.tabElements().find(tab => tab.isVisible);
        if (tabToActivate) {
            tabToActivate.isActive = true;
        }
    }
}
