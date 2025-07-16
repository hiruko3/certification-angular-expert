import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    ContentChildren,
    effect,
    output,
    OutputEmitterRef,
    Signal
} from '@angular/core';
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
export class TabsComponent<T> implements AfterContentInit{

    /**
     * This is our projected children's content.
     * It will retrieve all TabComponent instances that are children of this TabsComponent.
     */
    readonly tabElements: Signal<readonly TabComponent<T>[]> | undefined = contentChildren<TabComponent<T>>(TabComponent);

    /**
     * Used to retrieve the already defined tabs in the template.
     */
    @ContentChildren(TabComponent) tabsAlreadyDefined: TabComponent<T>[] | undefined;

    /**
     * This output emitter is used to notify when a tab is closed.
     */
    readonly onCloseTab: OutputEmitterRef<T> = output<T>();

    /**
     * Here we use signal reactivity to retrieve the tab elements and set the first tab as active by default.
     * When a new tab is added or removed, it will trigger the effect and check if there are any tabs.
     */
    constructor() {
        effect((): void => {
            const tabs: readonly TabComponent<T>[] = this.tabElements();
            if (tabs && tabs.length > 0) {
                // Set the first tab as active by default
                if (!tabs.some((tab: TabComponent<T>): boolean => tab.isActive)) {
                    this.activateFirstTabVisible(tabs);
                }
            }
        })
    }

    /**
     * Activate the first visible tab.
     * @param tabs
     * @private
     */
    private activateFirstTabVisible(tabs : readonly TabComponent<T>[]): void {
        const firstTabVisible: TabComponent<T> = tabs.find((tab: TabComponent<T>): boolean => tab.isVisible);
        if(firstTabVisible) {
            firstTabVisible.isActive = true;
            firstTabVisible.forceRendering();
        }
    }

    /**
     * Select a tab by setting its isActive property to true.
     * Deactivate all other tabs, we can only have one active tab at a time.
     * @param tab
     */
    selectTab(tab: TabComponent<T>): void {
        this.deactivateTab();
        tab.isActive = true;
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
     * emit the onCloseTab event to handle the logic outside the component.
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
        this.tabElements().forEach((tab: TabComponent<T>): void => {
            // Deactivate all tabs
            tab.isActive = false;
        })
    }

    /**
     * Activate the first visible tab
     * If no tab is visible, no tab will be activated.
     */
    activateFirstVisibleTab(): void {
        //Activate the first visible tab if the removed tab was active
        const tabToActivate: TabComponent<T> = this.tabElements().find((tab: TabComponent<T>):boolean => tab.isVisible);
        if (tabToActivate) {
            tabToActivate.isActive = true;
        }
    }


    /**
     * Returns the element reference of the tabs component when already defined.
     * It permits activating the first tab after the content rendering is done.
     * ContentChildren seem to have a little issue to handle correctly the first initialization on this angular version.
     */
    ngAfterContentInit(): void {
        this.activateFirstTabVisible(this.tabsAlreadyDefined);
    }
}
