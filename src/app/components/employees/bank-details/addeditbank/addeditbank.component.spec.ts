import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditbankComponent } from './addeditbank.component';

describe('AddeditbankComponent', () => {
  let component: AddeditbankComponent;
  let fixture: ComponentFixture<AddeditbankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditbankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
