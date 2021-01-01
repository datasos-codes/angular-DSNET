import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceListComponent } from './employee-attendance-list.component';

describe('EmployeeAttendanceListComponent', () => {
  let component: EmployeeAttendanceListComponent;
  let fixture: ComponentFixture<EmployeeAttendanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
