import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditAttendanceComponent } from './addeditattendance.component';

describe('AddeditAttendanceComponent', () => {
  let component: AddeditAttendanceComponent;
  let fixture: ComponentFixture<AddeditAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
