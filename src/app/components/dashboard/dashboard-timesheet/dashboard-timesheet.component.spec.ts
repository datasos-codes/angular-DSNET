import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTimesheetComponent } from './dashboard-timesheet.component';

describe('DashboardTimesheetComponent', () => {
  let component: DashboardTimesheetComponent;
  let fixture: ComponentFixture<DashboardTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
