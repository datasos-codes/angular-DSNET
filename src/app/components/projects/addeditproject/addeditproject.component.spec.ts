import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditprojectComponent } from './addeditproject.component';

describe('AddeditprojectComponent', () => {
  let component: AddeditprojectComponent;
  let fixture: ComponentFixture<AddeditprojectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
