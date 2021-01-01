import { NgModule } from '@angular/core';
import { AddeditCustomerComponent } from './addeditcustomer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        FormsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot(),
        DropdownModule
    ],
    exports: [AddeditCustomerComponent],
    declarations: [AddeditCustomerComponent],
    providers: [DatePipe]
})
export class AddEditCustomersModule { }
