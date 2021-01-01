import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AdminLeavesRequest } from '../models';
import { AdminLeaveApi } from '../shared';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class AdminLeavesService implements AdminLeaveApi {
    public headers: any = {
        'content-type': 'application/json',
        'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    private baseUrl: string = environment.baseUrl;
    private controllerName = '/Admin/Leave/';

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getAllAdminSideLeaves(filterObj: any): Observable<AdminLeavesRequest[]> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}Leave`;
        return this.http.post<AdminLeavesRequest[]>(serviceUrl, filterObj, { headers: this.headers })
            .pipe(map(adminLeavesRes => {
                return adminLeavesRes;
            }));
    }

    addEditAdminLeavesData(adminLeaveObj: any): Observable<AdminLeavesRequest[]> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertLeave`;
        return this.http.post<AdminLeavesRequest[]>(serviceUrl, adminLeaveObj, { headers: this.headers })
            .pipe(map(addEditAdminLeaveRes => {
                return addEditAdminLeaveRes;
            }));
    }

    deleteAdminLeaveById(leaveId: number, userId: number): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveLeave/${leaveId}/${userId}`;
        return this.http.post<any>(serviceUrl, { headers: this.headers })
            .pipe(map(deleteAdminLeaveRes => {
                return deleteAdminLeaveRes;
            }));
    }

    exportToExcelAdminLeave(adminLeaveIds: any): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
        const httpOption = {
            responseType: 'blob' as 'json',
            'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
        };
        return this.http.post<any>(serviceUrl, adminLeaveIds, httpOption)
            .pipe(map(excelFileRes => {
                return excelFileRes;
            }));
    }

    deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleLeaves`;
        return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
            .pipe(map(res => {
                return res;
            }));
    }
	
	// Employee Leaves
    getAllEmployeeSideLeaves(filterObj: any): Observable<AdminLeavesRequest[]> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}Leave`;
        return this.http.post<AdminLeavesRequest[]>(serviceUrl, filterObj, { headers: this.headers })
            .pipe(map(employeeLeaveRes => {
                return employeeLeaveRes;
            }));
    }

}
