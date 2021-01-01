import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignationsListComponent } from './designations-list/designations-list.component';

const routes: Routes = [
  {
    path: '',
    component: DesignationsListComponent,
    data: {
      title: 'Designations'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationsRoutingModule { }
