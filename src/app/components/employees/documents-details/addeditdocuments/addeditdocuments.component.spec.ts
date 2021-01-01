import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditdocumentsComponent } from './addeditdocuments.component';

describe('AddeditdocumentsComponent', () => {
  let component: AddeditdocumentsComponent;
  let fixture: ComponentFixture<AddeditdocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditdocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
