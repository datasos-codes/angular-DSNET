import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardAttendanceComponent } from './employee-dashboard-attendance.component';

describe('EmployeeDashboardAttendanceComponent', () => {
  let component: EmployeeDashboardAttendanceComponent;
  let fixture: ComponentFixture<EmployeeDashboardAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDashboardAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDashboardAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
