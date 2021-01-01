import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpermisstionComponent } from './editpermisstion.component';

describe('EditpermisstionComponent', () => {
  let component: EditpermisstionComponent;
  let fixture: ComponentFixture<EditpermisstionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpermisstionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpermisstionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
