import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewEmployeeleavesComponent } from './addviewemployee-leaves.component';

describe('AddViewEmployeeleavesComponent', () => {
  let component: AddViewEmployeeleavesComponent;
  let fixture: ComponentFixture<AddViewEmployeeleavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddViewEmployeeleavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddViewEmployeeleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
