import { MyButtonDirective } from './my-button.directive';

describe('MyButtonDirective', () => {
  it('should create an instance', () => {
    // Mock elementRef as button html element
    const mockElementRef = {
      nativeElement: document.createElement('button')
    };
    const directive = new MyButtonDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });

  it('should add class "tab-header-button" to the button element', () => {
    const mockElementRef = {
      nativeElement: document.createElement('button')
    };
    const directive = new MyButtonDirective(mockElementRef);

    // Check if the class was added
    expect(mockElementRef.nativeElement.classList.contains('tab-header-button')).toBeTrue();
  })
  it('should add class "tab-header-button" to elements with appMyButton directive', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div')
    };
    mockElementRef.nativeElement.setAttribute('appMyButton', '');
    const directive = new MyButtonDirective(mockElementRef);

    // Check if the class was added
    expect(mockElementRef.nativeElement.classList.contains('tab-header-button')).toBeTrue();
  })
});
