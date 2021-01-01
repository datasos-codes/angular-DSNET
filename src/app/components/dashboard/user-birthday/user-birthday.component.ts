import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SpinnerService, DashboardService } from '../../../services';
import { AdminDashboardApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';
import { SortEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-user-birthday',
  templateUrl: './user-birthday.component.html',
  styleUrls: ['./user-birthday.component.css']
})
export class UserBirthdayComponent implements OnInit {
  @ViewChild('userbirthdaytable') userbirthdaytable: Table;
  userBirthdayList: any = [];

  constructor(
    private spinnerService: SpinnerService,
    private adminDashboardApi: AdminDashboardApi,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getUserBirthdayDetails();
  }

  getUserBirthdayDetails() {
    this.spinnerService.showSpinner();
    this.adminDashboardApi.getAllUserBirthdayDetails().subscribe(dashboardUsersBirthdayRes => {
      if (dashboardUsersBirthdayRes && dashboardUsersBirthdayRes['flag'] === 1) {
        this.userBirthdayList = dashboardUsersBirthdayRes['data'];
        if (this.userBirthdayList.length > 0) {
          this.dashboardService.refreshBirthdayRes.next(true);
        } else {
          this.dashboardService.refreshBirthdayRes.next(false);
        }
        this.spinnerService.hideSpinner();
      }
    }, error => {
      console.log(error);
    });
  }

  customSortForEmployeeBirthdayTable(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        const test = value1.substr(2, 1);
        const date1 = moment(value1, 'DD-MMM-YYYY');
        const date2 = moment(value2, 'DD-MMM-YYYY');
        if (test === '-' || test === '/') {
          result = date1.diff(date2, 'days');
        } else {
          result = value1.localeCompare(value2);
        }
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }

      return (event.order * result);
    });
  }

}
