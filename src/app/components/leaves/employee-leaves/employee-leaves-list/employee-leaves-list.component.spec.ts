import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeleavesListComponent } from './employee-leaves-list.component';

describe('EmployeeleavesListComponent', () => {
  let component: EmployeeleavesListComponent;
  let fixture: ComponentFixture<EmployeeleavesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeleavesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeleavesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
