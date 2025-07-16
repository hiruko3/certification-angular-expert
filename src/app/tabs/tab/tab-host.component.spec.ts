import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
    template: `
    <app-tab [id]="1" [label]="'Tab 1'" #tab>
      <div class="projected-content">Hello Tab</div>
    </app-tab>
  `
})
class TestHostComponent {}

describe('TabComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let tabComponent: TabComponent<any>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabComponent],
            declarations: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;

        // Access the TabComponent instance
        const tabDebugEl = fixture.debugElement.children[0];
        tabComponent = tabDebugEl.componentInstance;
    });

    it('should project content only when isActive and isVisible are true', () => {
        // Case 1: both false
        tabComponent.isActive = false;
        tabComponent.isVisible = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.projected-content')).toBeNull();

        // Case 2: one true
        tabComponent.isActive = true;
        tabComponent.isVisible = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.projected-content')).toBeNull();

        // Case 3: both true
        tabComponent.isActive = true;
        tabComponent.isVisible = true;
        fixture.detectChanges();
        const projectedContent = fixture.nativeElement.querySelector('.projected-content');
        expect(projectedContent).not.toBeNull();
        expect(projectedContent.textContent).toEqual("Hello Tab");
    });
});
