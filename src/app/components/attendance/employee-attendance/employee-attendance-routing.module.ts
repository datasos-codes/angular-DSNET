import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAttendanceListComponent } from './employee-attendance-list/employee-attendance-list.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeAttendanceListComponent,
    data: {
      title: 'Attendances'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAttendanceRoutingModule { }
