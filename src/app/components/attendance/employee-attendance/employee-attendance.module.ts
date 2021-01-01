import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeAttendanceRoutingModule } from './employee-attendance-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EmployeeAttendanceListComponent } from './employee-attendance-list/employee-attendance-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Chirag primeNg
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ViewEmployeeAttendanceModule } from './viewemployee-attendance/viewemployee-attendance.module';
import { UiModalModule } from '../../../shared/components/ui-modal/ui-modal.module';

@NgModule({
  declarations: [EmployeeAttendanceListComponent],
  exports: [EmployeeAttendanceListComponent],
  imports: [
    CommonModule,
    FormsModule,
    EmployeeAttendanceRoutingModule,
    ViewEmployeeAttendanceModule,
    DataTablesModule.forRoot(),
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SpinnerModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    MessageModule,
    ToastModule,
    TooltipModule.forRoot(),
    UiModalModule
  ],
  providers: [
    MessageService,
    DatePipe
  ]
})
export class EmployeeAttendanceModule { }
