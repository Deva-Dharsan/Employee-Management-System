import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Layout } from './layout';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the sidebar collapsed state when the toggle button is clicked', () => {
    const toggleButton = fixture.nativeElement.querySelector('#sidebarToggle') as HTMLButtonElement;
    const sidebar = fixture.nativeElement.querySelector('#sidebar') as HTMLElement;

    expect(component.isSidebarCollapsed).toBeFalsy();
    expect(sidebar.classList.contains('collapsed')).toBeFalsy();

    toggleButton.click();
    fixture.detectChanges();

    expect(component.isSidebarCollapsed).toBeTruthy();
    expect(sidebar.classList.contains('collapsed')).toBeTruthy();

    toggleButton.click();
    fixture.detectChanges();

    expect(component.isSidebarCollapsed).toBeFalsy();
    expect(sidebar.classList.contains('collapsed')).toBeFalsy();
  });
});
