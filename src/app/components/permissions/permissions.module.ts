import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsComponent } from './permissions.component';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerModule } from '../../shared/components/spinner/spinner.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EditpermisstionModule } from './editpermisstion/editpermisstion.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UiModalModule } from '../../shared/components/ui-modal/ui-modal.module';

@NgModule({
  declarations: [PermissionsComponent],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    TooltipModule,
    EditpermisstionModule,
    TooltipModule.forRoot(),
    UiModalModule
  ],
  providers: [MessageService]
})
export class PermissionsModule { }
