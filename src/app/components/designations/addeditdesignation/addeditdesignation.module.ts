import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddeditdesignationComponent } from '../addeditdesignation/addeditdesignation.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    FormsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule.forRoot(),
    DropdownModule
  ],
  exports: [AddeditdesignationComponent],
  declarations: [AddeditdesignationComponent]
})
export class AddeditdesignationModule { }
