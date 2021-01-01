import { Component, OnInit, ViewChild } from '@angular/core';
import { SpinnerService, DashboardService } from '../../../services';
import { AdminDashboardApi } from '../../../shared/api';
import { DashboardAbsentUsersResponse } from '../../../models';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-dashboard-absentemployee',
  templateUrl: './dashboard-absentemployee.component.html',
  styleUrls: ['./dashboard-absentemployee.component.css']
})
export class DashboardAbsentemployeeComponent implements OnInit {
  @ViewChild('dashboardabsentemptable') dashboardabsentemptable: Table;
  dashboardAbsentEmployeeList: DashboardAbsentUsersResponse[];

  constructor(
    private spinnerService: SpinnerService,
    private adminDashboardApi: AdminDashboardApi,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.getAllDashboardAbsentEmployeeDetails();
  }

  getAllDashboardAbsentEmployeeDetails() {
    this.spinnerService.showSpinner();
    this.adminDashboardApi.getAllDashboardAbsentUsers().subscribe(dashboardRes => {
      if (dashboardRes && dashboardRes['flag'] === 1) {
        this.dashboardAbsentEmployeeList = dashboardRes['data'];
        if (this.dashboardAbsentEmployeeList.length > 0) {
          this.dashboardService.refreshAbsentEmployeeRes.next(true);
        } else {
          this.dashboardService.refreshAbsentEmployeeRes.next(false);
        }
        this.spinnerService.hideSpinner();
      }
    }, error => {
      console.log(error);
    });
  }

}
