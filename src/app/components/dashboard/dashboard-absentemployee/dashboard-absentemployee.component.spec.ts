import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAbsentemployeeComponent } from './dashboard-absentemployee.component';

describe('DashboardAbsentemployeeComponent', () => {
  let component: DashboardAbsentemployeeComponent;
  let fixture: ComponentFixture<DashboardAbsentemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAbsentemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAbsentemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
