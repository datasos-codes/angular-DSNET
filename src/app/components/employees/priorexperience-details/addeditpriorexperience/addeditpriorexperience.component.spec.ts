import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditPriorExperienceComponent } from './addeditpriorexperience.component';

describe('AddeditPriorExperienceComponent', () => {
  let component: AddeditPriorExperienceComponent;
  let fixture: ComponentFixture<AddeditPriorExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditPriorExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditPriorExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
