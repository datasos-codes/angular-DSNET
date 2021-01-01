import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingHolidayComponent } from './upcoming-holiday.component';

describe('UpcomingHolidayComponent', () => {
  let component: UpcomingHolidayComponent;
  let fixture: ComponentFixture<UpcomingHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
