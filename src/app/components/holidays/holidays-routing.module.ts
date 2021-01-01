import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidaysListComponent } from './holidays-list/holidays-list.component';

const routes: Routes = [
  {
    path: '',
    component: HolidaysListComponent,
    data: {
      title: 'Holidays'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidaysRoutingModule { }
