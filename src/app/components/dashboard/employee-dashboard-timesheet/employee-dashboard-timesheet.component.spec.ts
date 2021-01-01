import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardTimesheetComponent } from './employee-dashboard-timesheet.component';

describe('EmployeeDashboardTimesheetComponent', () => {
  let component: EmployeeDashboardTimesheetComponent;
  let fixture: ComponentFixture<EmployeeDashboardTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDashboardTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDashboardTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
