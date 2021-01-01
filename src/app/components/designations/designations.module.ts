import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DesignationsRoutingModule } from './designations-routing.module';
import { DesignationsListComponent } from './designations-list/designations-list.component';
import { AddeditdesignationModule } from './addeditdesignation/addeditdesignation.module';
import { SpinnerModule } from '../../shared/components/spinner/spinner.module';
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
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [DesignationsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DesignationsRoutingModule,
    AddeditdesignationModule,
    DataTablesModule.forRoot(),
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
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
export class DesignationsModule { }
