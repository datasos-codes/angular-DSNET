import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddEmployeeTimesheetComponent } from './add-employee-timesheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ButtonsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerModule } from './../../../../shared/components/spinner/spinner.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [AddEmployeeTimesheetComponent],
  imports: [
    FormsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgbModule,
    MessageModule,
    ToastModule,
    CalendarModule,
    DropdownModule,
    SpinnerModule,
    InputTextModule,
    InputTextareaModule
  ],
  exports: [AddEmployeeTimesheetComponent],
  providers: [DatePipe, MessageService],
})
export class AddEmployeeTimesheetModule { }
