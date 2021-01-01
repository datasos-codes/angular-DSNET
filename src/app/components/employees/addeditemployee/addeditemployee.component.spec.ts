import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditemployeeComponent } from './addeditemployee.component';

describe('AddeditemployeeComponent', () => {
  let component: AddeditemployeeComponent;
  let fixture: ComponentFixture<AddeditemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
