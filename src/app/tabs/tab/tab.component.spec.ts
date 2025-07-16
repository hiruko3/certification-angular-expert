import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';


describe('TabComponent', () => {


  let component: TabComponent<string>;
  let fixture: ComponentFixture<TabComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default label as empty string', () => {
    expect(component.label()).toBe('');
  })
  it('should be visible by default', () => {
    expect(component.isVisible).toBeTrue();
  })
  it('should not be active by default', () => {
    expect(component.isActive).toBeFalse();
  })
});
