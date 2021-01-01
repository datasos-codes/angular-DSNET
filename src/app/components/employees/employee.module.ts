import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeesComponent } from './employees.component';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AddressListComponent } from './address-details/address-list/address-list.component';
import { AddeditemployeeComponent } from './addeditemployee/addeditemployee.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MobileListComponent } from './mobile-details/mobile-list/mobile-list.component';
import { AddeditmobileComponent } from './mobile-details/addeditmobile/addeditmobile.component';
import { EmailListComponent } from './email-details/email-list/email-list.component';
import { AddeditemailComponent } from './email-details/addeditemail/addeditemail.component';
import { DesignationListComponent } from './designation-details/designation-list/designation-list.component';
import { AddeditdesignationComponent } from './designation-details/addeditdesignation/addeditdesignation.component';
import { SalaryListComponent } from './salary-details/salary-list/salary-list.component';
import { AddeditsalaryComponent } from './salary-details/addeditsalary/addeditsalary.component';
import { DocumentsListComponent } from './documents-details/documents-list/documents-list.component';
import { AddeditdocumentsComponent } from './documents-details/addeditdocuments/addeditdocuments.component';
import { BankListComponent } from './bank-details/bank-list/bank-list.component';
import { AddeditbankComponent } from './bank-details/addeditbank/addeditbank.component';
import { AddeditaddressComponent } from './address-details/addeditaddress/addeditaddress.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PriorExperienceListComponent } from '../employees/priorexperience-details/priorexperience-list/priorexperience-list.component';
import { AddeditPriorExperienceComponent } from './priorexperience-details/addeditpriorexperience/addeditpriorexperience.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SpinnerModule } from '../../shared/components/spinner/spinner.module';
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
import { UiModalModule } from '../../shared/components/ui-modal/ui-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EmployeeRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    TabsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
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
  declarations: [
    EmployeesComponent,
    ViewEmployeeComponent,
    AddressListComponent,
    AddeditemployeeComponent,
    MobileListComponent,
    AddeditmobileComponent,
    EmailListComponent,
    AddeditemailComponent,
    DesignationListComponent,
    AddeditdesignationComponent,
    SalaryListComponent,
    AddeditsalaryComponent,
    DocumentsListComponent,
    AddeditdocumentsComponent,
    BankListComponent,
    AddeditbankComponent,
    AddeditaddressComponent,
    AddeditPriorExperienceComponent,
    PriorExperienceListComponent
  ],
  providers: [
    BsModalRef,
    DatePipe,
    MessageService
  ],
  entryComponents: [
    AddeditaddressComponent,
    AddeditmobileComponent,
    AddeditemailComponent,
    AddeditdesignationComponent,
    AddeditsalaryComponent,
    AddeditdocumentsComponent,
    AddeditbankComponent,
    AddeditPriorExperienceComponent
  ]
})
export class EmployeeModule { }
