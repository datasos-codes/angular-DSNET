import { NgModule } from '@angular/core';
import { AddeditAttendanceComponent } from './addeditattendance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
        FormsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        BsDatepickerModule.forRoot(),
        DropdownModule,
        CalendarModule
    ],
    exports: [AddeditAttendanceComponent],
    declarations: [AddeditAttendanceComponent],
    providers: [DatePipe]
})
export class AddEditAttendanceModule { }
