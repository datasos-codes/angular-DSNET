import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTimesheetComponent } from './add-employee-timesheet.component';

describe('AddEmployeeTimesheetComponent', () => {
  let component: AddEmployeeTimesheetComponent;
  let fixture: ComponentFixture<AddEmployeeTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
