import { NgModule } from '@angular/core';
import { AddeditTimeSheetComponent } from './addedittimesheet.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        FormsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot(),
        NgbModule,
        MessageModule,
        ToastModule,
        CalendarModule,
        DropdownModule
    ],
    exports: [AddeditTimeSheetComponent],
    declarations: [AddeditTimeSheetComponent],
    providers: [DatePipe, MessageService]
})
export class AddEditTimeSheetModule { }
