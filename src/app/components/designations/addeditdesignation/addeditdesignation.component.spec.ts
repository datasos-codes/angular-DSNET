import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditdesignationComponent } from './addeditdesignation.component';

describe('AddeditdesignationComponent', () => {
  let component: AddeditdesignationComponent;
  let fixture: ComponentFixture<AddeditdesignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditdesignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditdesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
