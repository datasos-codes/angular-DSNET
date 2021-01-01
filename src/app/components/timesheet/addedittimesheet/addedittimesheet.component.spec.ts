import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditTimeSheetComponent } from './addedittimesheet.component';

describe('AddeditTimeSheetComponent', () => {
  let component: AddeditTimeSheetComponent;
  let fixture: ComponentFixture<AddeditTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
