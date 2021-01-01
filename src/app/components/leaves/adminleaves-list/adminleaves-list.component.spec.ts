import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminleavesListComponent } from './adminleaves-list.component';

describe('AdminleavesListComponent', () => {
  let component: AdminleavesListComponent;
  let fixture: ComponentFixture<AdminleavesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminleavesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminleavesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
