import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditCustomerComponent } from './addeditcustomer.component';

describe('AddeditCustomerComponent', () => {
  let component: AddeditCustomerComponent;
  let fixture: ComponentFixture<AddeditCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
