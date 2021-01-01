import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditholidayComponent } from './addeditholiday.component';

describe('AddeditholidayComponent', () => {
  let component: AddeditholidayComponent;
  let fixture: ComponentFixture<AddeditholidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditholidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
