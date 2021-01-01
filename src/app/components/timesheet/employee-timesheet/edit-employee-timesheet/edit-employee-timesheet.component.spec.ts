import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEmployeeTimeSheetComponent } from './edit-employee-timesheet.component';

describe('EditEmployeeTimeSheetComponent', () => {
  let component: EditEmployeeTimeSheetComponent;
  let fixture: ComponentFixture<EditEmployeeTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
