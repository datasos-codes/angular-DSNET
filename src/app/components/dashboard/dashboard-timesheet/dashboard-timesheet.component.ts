import { Component, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from '../../../services';
import { AdminDashboardApi } from '../../../shared/api';
import { DashboardUserTimesheetResponse } from '../../../models';
import { Table } from 'primeng/table/table';
import { SortEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-timesheet',
  templateUrl: './dashboard-timesheet.component.html',
  styleUrls: ['./dashboard-timesheet.component.css']
})
export class DashboardTimesheetComponent implements OnInit {
  @ViewChild('dashboardtimesheettable') dashboardtimesheettable: Table;
  timeSheetList: DashboardUserTimesheetResponse[];

  constructor(
    private spinnerService: SpinnerService,
    private adminDashboardApi: AdminDashboardApi,
  ) { }

  ngOnInit() {
    this.getAllDashboardTimesheetDetails();
  }

  getAllDashboardTimesheetDetails() {
    this.spinnerService.showSpinner();
    this.adminDashboardApi.getAllDashboardUsersTimesheet().subscribe(dashboardRes => {
      if (dashboardRes && dashboardRes['flag'] === 1) {
        this.timeSheetList = dashboardRes['data'];
        this.spinnerService.hideSpinner();
      }
    }, error => {
      console.log(error);
    });
  }

  customSortForDashboardTimesheetTable(event: SortEvent) {
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
