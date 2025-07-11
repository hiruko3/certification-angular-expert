import {ChangeDetectionStrategy, ChangeDetectorRef, Component, input, Signal} from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TabComponent<T> {

  /**
   * That will permit sending the id associated with the tab when performing actions.
   */
  id : Signal<T> = input.required<T>();

  /**
   * The label for the tab, displayed in the tab header.
   */
  label : Signal<string> = input<string>("");


  /**
   * Indicates whether the tab is currently active.
   * We only display the content of the tab if it is active.
   */
  isActive = false;

  /**
   * Property to display the tab.
   * If we remove a tab, we can hide it instead of removing it from the DOM.
   * We don't want to mutate the DOM directly, so we use this property to control visibility.
   */
  isVisible = true;

  constructor (private changeDetectorRef: ChangeDetectorRef) {
  }

  /**
   * Needed the first time the tab is rendered.
   * AfterContentInit is called after signal reactivity is set up,
   * so that the component can respond to changes in its inputs.
   * It Should be implemented with specific internal logic that displays dynamic content.
   */
  forceRendering(): void {
    this.changeDetectorRef.detectChanges();
  }

}
