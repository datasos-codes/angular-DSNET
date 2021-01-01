import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditsalaryComponent } from './addeditsalary.component';

describe('AddeditsalaryComponent', () => {
  let component: AddeditsalaryComponent;
  let fixture: ComponentFixture<AddeditsalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditsalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditsalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
