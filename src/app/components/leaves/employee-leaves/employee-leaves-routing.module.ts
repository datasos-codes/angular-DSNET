import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeleavesListComponent } from './employee-leaves-list/employee-leaves-list.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeleavesListComponent,
    data: {
      title: 'Leaves'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeleavesRoutingModule { }
