import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditModuleComponent } from './add-edit-module.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ButtonsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [AddEditModuleComponent],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    MessageModule,
    ToastModule,
    DropdownModule
  ],
  exports: [AddEditModuleComponent],
  providers: [MessageService]
})
export class AddEditModuleModule { }
