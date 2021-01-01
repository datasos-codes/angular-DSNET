import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { AddeditemployeeComponent } from './addeditemployee/addeditemployee.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    data: {
      title: 'Employees'
    }
  },
  {
    path: 'viewemployee/:id',
    component: ViewEmployeeComponent,
    data: {
      title: 'View Employee'
    }
  },
  {
    path: 'addemployee',
    component: AddeditemployeeComponent,
    data: {
      title: 'Employees'
    }
  },
  {
    path: 'editemployee/:employeeId',
    component: AddeditemployeeComponent,
    data: {
      title: 'Employees'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
