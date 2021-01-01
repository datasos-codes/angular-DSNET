import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTimeSheetListComponent } from './employee-timesheet-list/employee-timesheet-list.component';
import { AddEmployeeTimesheetComponent } from './add-employee-timesheet/add-employee-timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeTimeSheetListComponent,
    data: {
      title: 'Timesheets'
    }
  },
  {
    path: 'add',
    component: AddEmployeeTimesheetComponent,
    data: {
      title: 'Add Timesheet'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTimeSheetRoutingModule { }
