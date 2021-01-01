import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeSheetListComponent } from './timesheet-list/timesheet-list.component';

const routes: Routes = [
  {
    path: '',
    component: TimeSheetListComponent,
    data: {
      title: 'Timesheets'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetRoutingModule { }
