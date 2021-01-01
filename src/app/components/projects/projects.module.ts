import { AddEditModuleModule } from './add-edit-module/add-edit-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsRoutingModule } from './projects-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { AddeditProjectModule } from './addeditproject/addeditproject.module';
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

@NgModule({
  declarations: [ProjectsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ProjectsRoutingModule,
    AddeditProjectModule,
    AddEditModuleModule,
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
  providers: [MessageService]
})
export class ProjectsModule { }
