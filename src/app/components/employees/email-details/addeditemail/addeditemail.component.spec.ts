import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditemailComponent } from './addeditemail.component';

describe('AddeditemailComponent', () => {
  let component: AddeditemailComponent;
  let fixture: ComponentFixture<AddeditemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
