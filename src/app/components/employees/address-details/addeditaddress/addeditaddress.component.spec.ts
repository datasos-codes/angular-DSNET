import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditaddressComponent } from './addeditaddress.component';

describe('AddeditaddressComponent', () => {
  let component: AddeditaddressComponent;
  let fixture: ComponentFixture<AddeditaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
