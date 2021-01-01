import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddeditdocumentRoutingModule } from './addeditdocument-routing.module';
import { AddeditdocumentComponent } from './addeditdocument.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [AddeditdocumentComponent],
  imports: [
    CommonModule,
    AddeditdocumentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    FileUploadModule,
  ],
  exports: [AddeditdocumentComponent]
})
export class AddeditdocumentModule { }
