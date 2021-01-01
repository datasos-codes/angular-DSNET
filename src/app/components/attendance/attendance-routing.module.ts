import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceListComponent,
    data: {
      title: 'Attendances'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
