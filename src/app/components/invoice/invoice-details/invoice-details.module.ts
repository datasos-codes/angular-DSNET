import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceDetailsRoutingModule } from './invoice-details-routing.module';
import { InvoiceDetailsComponent } from './invoice-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { CalendarModule } from 'primeng/calendar';
import { DirectivesModule } from './../../../shared/directive/directives.module';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [InvoiceDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    SpinnerModule,
    InvoiceDetailsRoutingModule,
    CalendarModule,
    DirectivesModule,
    TableModule
  ]
})
export class InvoiceDetailsModule { }
