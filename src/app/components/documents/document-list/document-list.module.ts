import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListRoutingModule } from './document-list-routing.module';
import { DocumentListComponent } from './document-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonsModule } from 'ngx-bootstrap';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { DropdownModule } from 'primeng/dropdown';
import { UiModalModule } from '../../../shared/components/ui-modal/ui-modal.module';
import { AddeditdocumentModule } from '../addeditdocument/addeditdocument.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [DocumentListComponent],
  imports: [
    CommonModule,
    DocumentListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonsModule.forRoot(),
    SpinnerModule,
    DropdownModule,
    ToastModule,
    ButtonModule,
    MultiSelectModule,
    MessageModule,
    AddeditdocumentModule,
    UiModalModule,
    TooltipModule.forRoot(),
  ],
  providers: [MessageService]
})
export class DocumentListModule { }
