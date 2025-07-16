import {ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {TabsComponent} from './tabs.component';
import {TabComponent} from './tab/tab.component';

@Component({
    template: `
        <app-tabs>
            <app-tab [label]="'Tab 1'" [id]="1" #tab1>
                <div class="projected-content">Tab 1 Content</div>
            </app-tab>
            <app-tab [label]="'Tab 2'" [id]="2" #tab2>
                <div class="projected-content">Tab 2 Content</div>
            </app-tab>
        </app-tabs>
    `
})
class TestHostComponent {
}

describe('TabsComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabsComponent, TabComponent],
            declarations: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostElement = fixture.nativeElement;
    });

    it('should activate the first visible tab by default', () => {
        fixture.detectChanges();

        const contents = hostElement.querySelectorAll('.projected-content');
        const visibleContents = Array.from(contents).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });

        expect(visibleContents.length).toBe(1);
        expect(visibleContents[0].textContent).toContain('Tab 1 Content');
    });

    it('should switch active tab when selectTab is called', () => {
        fixture.detectChanges();

        const tabsComponent = fixture.debugElement.children[0].componentInstance as TabsComponent<number>;
        const tabs = tabsComponent.tabElements();

        tabsComponent.selectTab(tabs[1]);
        fixture.detectChanges();

        expect(tabs[0].isActive).toBeFalse();
        expect(tabs[1].isActive).toBeTrue();
    });

    it('should retrieve all tab elements', () => {
        fixture.detectChanges();

        const tabsComponent = fixture.debugElement.children[0].componentInstance as TabsComponent<number>;
        const tabs = tabsComponent.tabElements();
        expect(tabs.length).toBe(2);
    })

    it("should active the first tab in reactive context", () => {

        const tabsComponent = fixture.debugElement.children[0].componentInstance as TabsComponent<number>;
        const tabs = tabsComponent.tabElements();

        expect(tabs[0].isActive).toBeFalse();
        expect(tabs[1].isActive).toBeFalse();

        fixture.detectChanges();
        expect(tabs[0].isActive).toBeTrue();
        expect(tabs[1].isActive).toBeFalse();

    })

    it('should hide a tab and activate the next visible one', () => {
        fixture.detectChanges();

        const tabsComponent = fixture.debugElement.children[0].componentInstance as TabsComponent<number>;
        const tabs = tabsComponent.tabElements();

        tabs[0].isActive = true;
        tabs[1].isVisible = true;
        tabsComponent.removeTab(tabs[0]);
        fixture.detectChanges();

        expect(tabs[0].isVisible).toBeFalse();
        expect(tabs[1].isActive).toBeTrue();
    })
    it('should not activate any tab if all are hidden', () => {
        fixture.detectChanges();

        const tabsComponent = fixture.debugElement.children[0].componentInstance as TabsComponent<number>;
        const tabs = tabsComponent.tabElements();

        tabs.forEach(tab => {
            tabsComponent.removeTab(tab);
        });
        fixture.detectChanges();

        expect(tabs.some(tab => tab.isActive)).toBeFalse();
    })
});
