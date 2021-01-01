import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AdminDashboardApi } from '../shared/api';
import { DashboardUsersLeavesResponse, DashboardAbsentUsersResponse, DashboardUserTimesheetResponse, DashboardUsersAttendanceResponse } from '../models';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements AdminDashboardApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl: string = environment.baseUrl;
  private adminControllerName = '/Admin/Dashboard/';
  private employeeControllerName = '/Employee/Dashboard/';
  refreshBirthdayRes = new BehaviorSubject<any>(false);
  refreshAdminDashboardLeaveRes = new BehaviorSubject<any>(false);
  refreshEmployeeDashboardLeaveRes = new BehaviorSubject<any>(false);
  refreshAbsentEmployeeRes = new BehaviorSubject<any>(false);
  refreshDashboardHolidayRes = new BehaviorSubject<any>(false);

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  // Start admin dashboard
  getAllDashboardUserLeaves(): Observable<DashboardUsersLeavesResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.adminControllerName}Leave`;
    return this.http.get<DashboardUsersLeavesResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(userLeavesResponse => {
        return userLeavesResponse;
      })
    );
  }

  getAllDashboardAbsentUsers(): Observable<DashboardAbsentUsersResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.adminControllerName}AbsentEmployee`;
    return this.http.get<DashboardAbsentUsersResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(absentUsersResponse => {
        return absentUsersResponse;
      })
    );
  }

  getAllDashboardUsersTimesheet(): Observable<DashboardUserTimesheetResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.adminControllerName}Timesheet`;
    return this.http.get<DashboardUserTimesheetResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(usersTimesheetResponse => {
        return usersTimesheetResponse;
      })
    );
  }

  getAllDashboardUsersAttendance(): Observable<DashboardUsersAttendanceResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.adminControllerName}Attendence`;
    return this.http.get<DashboardUsersAttendanceResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(usersAttendanceResponse => {
        return usersAttendanceResponse;
      })
    );
  }
  // End admin dashboard

  // Start employee dashboard
  getAllDashboardEmployeeLeaves(employeeId: number): Observable<DashboardUsersLeavesResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.employeeControllerName}Leave/${employeeId}`;
    return this.http.get<DashboardUsersLeavesResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(employeeDashboardLeavesResponse => {
        return employeeDashboardLeavesResponse;
      })
    );
  }

  getAllDashboardEmployeeAttendance(employeeId: number): Observable<DashboardUsersAttendanceResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.employeeControllerName}Attendence/${employeeId}`;
    return this.http.get<DashboardUsersAttendanceResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(employeeAttendanceResponse => {
        return employeeAttendanceResponse;
      })
    );
  }

  getAllDashboardEmployeeTimesheet(employeeId: number): Observable<DashboardUserTimesheetResponse[]> {
    const serviceUrl = `${this.baseUrl}${this.employeeControllerName}Timesheet/${employeeId}`;
    return this.http.get<DashboardUserTimesheetResponse[]>(serviceUrl, { headers: this.headers }).pipe(
      map(employeeTimesheetResponse => {
        return employeeTimesheetResponse;
      })
    );
  }
  // End employee dashboard

  getAllUserBirthdayDetails(): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.adminControllerName}GetBirthday`;
    return this.http.get<any>(serviceUrl, { headers: this.headers }).pipe(
      map(userBirthdayRes => {
        return userBirthdayRes;
      })
    );
  }

  getAllUpcomingHolidayDetails(): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.adminControllerName}GetHoliday`;
    return this.http.get<any>(serviceUrl, { headers: this.headers }).pipe(
      map(dashboardHolidayRes => {
        return dashboardHolidayRes;
      })
    );
  }
}
