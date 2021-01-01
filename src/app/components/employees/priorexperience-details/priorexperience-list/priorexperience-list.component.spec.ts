import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorExperienceListComponent } from './priorexperience-list.component';

describe('PriorExperienceListComponent', () => {
  let component: PriorExperienceListComponent;
  let fixture: ComponentFixture<PriorExperienceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorExperienceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorExperienceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
