import {Directive, ElementRef} from '@angular/core';

/**
 * MyButtonDirective adds a custom class to all button elements or elements with the `appMyButton` directive.
 */
@Directive({
  selector: '[appMyButton], button',
  standalone: true
})
export class MyButtonDirective {

  constructor(private elementRef : ElementRef) {
    // Add a 'tab-header-button' class to the element
    this.elementRef.nativeElement.classList.add('tab-header-button');
  }

}
