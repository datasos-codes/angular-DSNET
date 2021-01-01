import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AddEditAttendanceModule } from './addeditattendance/addeditattendance.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SpinnerModule } from '../../shared/components/spinner/spinner.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UiModalModule } from '../../shared/components/ui-modal/ui-modal.module';

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
import { EmployeeAttendanceModule } from './employee-attendance/employee-attendance.module';

@NgModule({
  declarations: [AttendanceListComponent],
  imports: [
    CommonModule,
    FormsModule,
    AttendanceRoutingModule,
    AddEditAttendanceModule,
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
    UiModalModule,
    EmployeeAttendanceModule
  ],
  providers: [
    MessageService
  ]
})
export class AttendanceModule { }
