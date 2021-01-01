import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AddeditadminleaveComponent } from './addeditadminleave.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
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
  exports: [AddeditadminleaveComponent],
  declarations: [AddeditadminleaveComponent],
  providers: [DatePipe]
})
export class AddeditadminleaveModule { }
