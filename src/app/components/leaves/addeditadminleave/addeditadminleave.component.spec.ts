import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditadminleaveComponent } from './addeditadminleave.component';

describe('AddeditadminleaveComponent', () => {
  let component: AddeditadminleaveComponent;
  let fixture: ComponentFixture<AddeditadminleaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditadminleaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditadminleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
