import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminleavesListComponent } from './adminleaves-list/adminleaves-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminleavesListComponent,
    data: {
      title: 'Leaves'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminleavesRoutingModule { }
