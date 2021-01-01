import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminleavesListComponent } from './adminleaves-list/adminleaves-list.component';
import { AdminleavesRoutingModule } from './leaves-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddeditadminleaveModule } from './addeditadminleave/addeditadminleave.module';
import { SpinnerModule } from '../../shared/components/spinner/spinner.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
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
import { EmployeeleavesModule } from './employee-leaves/employee-leaves.module';

@NgModule({
  declarations: [AdminleavesListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminleavesRoutingModule,
    AddeditadminleaveModule,
    DataTablesModule.forRoot(),
    BsDropdownModule,
    ButtonsModule.forRoot(),
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
    EmployeeleavesModule
  ],
  providers: [
    MessageService
  ]
})
export class LeavesModule { }
