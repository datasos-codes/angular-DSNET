import { Component, OnInit, ViewChild } from '@angular/core';
import { SpinnerService, DashboardService } from '../../../services';
import { AdminDashboardApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-upcoming-holiday',
  templateUrl: './upcoming-holiday.component.html',
  styleUrls: ['./upcoming-holiday.component.css']
})
export class UpcomingHolidayComponent implements OnInit {
  @ViewChild('upcomingholiday') upcomingholiday: Table;
  upComingHolidaysList: any = [];

  constructor(
    private spinnerService: SpinnerService,
    private adminDashboardApi: AdminDashboardApi,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getUpcomingHolidayDetails();
  }

  getUpcomingHolidayDetails() {
    this.spinnerService.showSpinner();
    this.adminDashboardApi.getAllUpcomingHolidayDetails().subscribe(dashboardHolidayRes => {
      if (dashboardHolidayRes && dashboardHolidayRes['flag'] === 1) {
        this.upComingHolidaysList = dashboardHolidayRes['data'];
        if (this.upComingHolidaysList.length > 0) {
          this.dashboardService.refreshDashboardHolidayRes.next(true);
        } else {
          this.dashboardService.refreshDashboardHolidayRes.next(false);
        }
        this.spinnerService.hideSpinner();
      }
    }, error => {
      console.log(error);
    });
  }

}
