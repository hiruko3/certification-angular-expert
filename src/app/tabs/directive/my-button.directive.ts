import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appMyButton], button',
  standalone: true
})
export class MyButtonDirective {

  constructor(private elementRef : ElementRef) {
    // Add a class to the button element
    this.elementRef.nativeElement.classList.add('my-button');
  }

}
