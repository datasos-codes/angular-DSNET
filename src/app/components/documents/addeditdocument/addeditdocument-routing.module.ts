import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddeditdocumentComponent } from './addeditdocument.component';

const routes: Routes = [{ path: '', component: AddeditdocumentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddeditdocumentRoutingModule { }
