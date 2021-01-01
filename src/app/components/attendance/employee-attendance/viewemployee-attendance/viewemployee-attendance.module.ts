import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewEmployeeAttendanceComponent } from './viewemployee-attendance.component';

@NgModule({
    imports: [
        FormsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        NgbModule,
        BsDatepickerModule.forRoot()
    ],
    exports: [ViewEmployeeAttendanceComponent],
    declarations: [ViewEmployeeAttendanceComponent],
    providers: [DatePipe]
})
export class ViewEmployeeAttendanceModule { }
