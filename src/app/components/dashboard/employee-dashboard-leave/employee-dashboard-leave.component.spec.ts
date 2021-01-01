import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardLeaveComponent } from './employee-dashboard-leave.component';

describe('EmployeeDashboardLeaveComponent', () => {
  let component: EmployeeDashboardLeaveComponent;
  let fixture: ComponentFixture<EmployeeDashboardLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDashboardLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDashboardLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
