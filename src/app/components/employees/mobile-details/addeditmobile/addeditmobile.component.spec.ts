import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditmobileComponent } from './addeditmobile.component';

describe('AddeditmobileComponent', () => {
  let component: AddeditmobileComponent;
  let fixture: ComponentFixture<AddeditmobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditmobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
