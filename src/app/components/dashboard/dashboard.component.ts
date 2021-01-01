import { Component, OnInit } from '@angular/core';
import { AuthenticationService, SpinnerService, DashboardService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loggedInUserDataId: any;
  isNeedToRenderAdminData = false;
  isNeedToRenderEmployeeData = false;
  birthdayRes: boolean;
  adminLeaveRes: boolean;
  employeeLeaveRes: boolean;
  absentEmployeeRes: boolean;
  holidayRes: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private spinnerService: SpinnerService,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
    // this.spinnerService.showSpinner();
    // const promise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve();
    //   }, 1500);
    // });
    // promise.then(() => {
    this.roleBasedDataBinding();
    this.dashboardService.refreshBirthdayRes.subscribe(birthdayRes => {
      this.birthdayRes = birthdayRes === true ? true : false;
    });
    this.dashboardService.refreshAdminDashboardLeaveRes.subscribe(adminLeaveres => {
      this.adminLeaveRes = adminLeaveres === true ? true : false;
    });
    this.dashboardService.refreshEmployeeDashboardLeaveRes.subscribe(employeeLeaveRes => {
      this.employeeLeaveRes = employeeLeaveRes === true ? true : false;
    });
    this.dashboardService.refreshAbsentEmployeeRes.subscribe(absentEmployeeRes => {
      this.absentEmployeeRes = absentEmployeeRes === true ? true : false;
    });
    this.dashboardService.refreshDashboardHolidayRes.subscribe(holidayRes => {
      this.holidayRes = holidayRes === true ? true : false;
    });
    //   this.spinnerService.hideSpinner();
    // });
  }

  private roleBasedDataBinding() {
    if (this.authenticationService.isAdmin()) {
      this.isNeedToRenderAdminData = true;
    } else {
      this.isNeedToRenderEmployeeData = true;
    }
  }
}
