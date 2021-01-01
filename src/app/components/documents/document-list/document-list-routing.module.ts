import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentListComponent } from './document-list.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentListComponent,
    data: {
      title: 'Documents'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentListRoutingModule { }
