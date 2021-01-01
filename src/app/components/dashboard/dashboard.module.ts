import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { SpinnerModule } from '../../shared/components/spinner/spinner.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DashboardAttendanceComponent } from './dashboard-attendance/dashboard-attendance.component';
import { DashboardLeaverequestComponent } from './dashboard-leaverequest/dashboard-leaverequest.component';
import { DashboardTimesheetComponent } from './dashboard-timesheet/dashboard-timesheet.component';
import { DashboardAbsentemployeeComponent } from './dashboard-absentemployee/dashboard-absentemployee.component';


// Chirag primeNg
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { EmployeeDashboardLeaveComponent } from './employee-dashboard-leave/employee-dashboard-leave.component';
import { EmployeeDashboardAttendanceComponent } from './employee-dashboard-attendance/employee-dashboard-attendance.component';
import { EmployeeDashboardTimesheetComponent } from './employee-dashboard-timesheet/employee-dashboard-timesheet.component';
import { UserBirthdayComponent } from './user-birthday/user-birthday.component';
import { UpcomingHolidayComponent } from './upcoming-holiday/upcoming-holiday.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule.forRoot(),
    SpinnerModule,
    TabsModule,
    TableModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    TooltipModule
  ],
  declarations: [
    DashboardComponent,
    DashboardAttendanceComponent,
    DashboardLeaverequestComponent,
    DashboardTimesheetComponent,
    DashboardAbsentemployeeComponent,
    EmployeeDashboardLeaveComponent,
    EmployeeDashboardAttendanceComponent,
    EmployeeDashboardTimesheetComponent,
    UserBirthdayComponent,
    UpcomingHolidayComponent
  ],
  providers: [
    MessageService
  ]
})
export class DashboardModule { }
