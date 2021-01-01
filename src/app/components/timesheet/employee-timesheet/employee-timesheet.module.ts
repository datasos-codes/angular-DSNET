import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeTimeSheetListComponent } from './employee-timesheet-list/employee-timesheet-list.component';
import { EmployeeTimeSheetRoutingModule } from './employee-timesheet-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { EditEmployeeTimeSheetModule } from './edit-employee-timesheet/edit-employee-timesheet.module';
import { UiModalModule } from './../../../shared/components/ui-modal/ui-modal.module';

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
import { AddEmployeeTimesheetModule } from './add-employee-timesheet/add-employee-timesheet.module';

@NgModule({
  declarations: [EmployeeTimeSheetListComponent],
  exports: [EmployeeTimeSheetListComponent],
  imports: [
    CommonModule,
    FormsModule,
    EmployeeTimeSheetRoutingModule,
    EditEmployeeTimeSheetModule,
    AddEmployeeTimesheetModule,
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
    MessageService
  ]
})
export class EmployeeTimeSheetModule { }
