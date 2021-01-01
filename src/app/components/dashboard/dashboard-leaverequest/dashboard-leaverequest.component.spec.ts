import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLeaverequestComponent } from './dashboard-leaverequest.component';

describe('DashboardLeaverequestComponent', () => {
  let component: DashboardLeaverequestComponent;
  let fixture: ComponentFixture<DashboardLeaverequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLeaverequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLeaverequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
