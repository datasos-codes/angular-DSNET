import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EditpermisstionComponent } from './editpermisstion.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

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
        InputTextareaModule,
        TableModule,
        CheckboxModule,
    ],
    exports: [EditpermisstionComponent],
    declarations: [EditpermisstionComponent],
    providers: [DatePipe, MessageService],
})
export class EditpermisstionModule { }
