
import { Observable } from 'rxjs';
import { DashboardUsersLeavesResponse, DashboardAbsentUsersResponse, DashboardUserTimesheetResponse, DashboardUsersAttendanceResponse } from '../../models';

export abstract class AdminDashboardApi {
    // Start admin dashboard
    abstract getAllDashboardUserLeaves(): Observable<DashboardUsersLeavesResponse[]>;
    abstract getAllDashboardAbsentUsers(): Observable<DashboardAbsentUsersResponse[]>;
    abstract getAllDashboardUsersTimesheet(): Observable<DashboardUserTimesheetResponse[]>;
    abstract getAllDashboardUsersAttendance(): Observable<DashboardUsersAttendanceResponse[]>;
    // End admin dashboard

    // Start employee dashboard
    abstract getAllDashboardEmployeeLeaves(employeeId: number): Observable<DashboardUsersLeavesResponse[]>;
    abstract getAllDashboardEmployeeAttendance(employeeId: number): Observable<DashboardUsersAttendanceResponse[]>;
    abstract getAllDashboardEmployeeTimesheet(employeeId: number): Observable<DashboardUserTimesheetResponse[]>;
    // End employee dashboard

    abstract getAllUserBirthdayDetails(): Observable<any>;
    abstract getAllUpcomingHolidayDetails(): Observable<any>;
}
