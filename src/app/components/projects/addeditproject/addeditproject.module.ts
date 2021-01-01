import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddeditProjectComponent } from './addeditproject.component';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        FormsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot(),
        MessageModule,
        ToastModule,
        DropdownModule,
    ],
    exports: [AddeditProjectComponent],
    declarations: [AddeditProjectComponent],
    providers: [MessageService]
})
export class AddeditProjectModule { }
