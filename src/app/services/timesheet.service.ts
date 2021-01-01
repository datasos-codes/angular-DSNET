import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { TimeSheetRequest, AddEmployeeTimesheetRequest } from '../models';
import { Observable } from 'rxjs';
import { TimeSheetApi } from '../shared/api';
import { AuthenticationService } from '.';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService implements TimeSheetApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl = environment.baseUrl;
  private controllerName = '/Admin/Timesheet/';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getTimeSheetList(filterObj: any): Observable<TimeSheetRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}Timesheet`;
    return this.http.post<TimeSheetRequest[]>(serviceUrl, filterObj, { headers: this.headers })
      .pipe(map(timeSheetRes => {
        return timeSheetRes;
      }));
  }

  addEdittimeSheetDetails(timesheetObj: any): Observable<TimeSheetRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertTimeSheet`;
    return this.http.post<TimeSheetRequest[]>(serviceUrl, timesheetObj, { headers: this.headers })
      .pipe(map(adeditTimeSheetREs => {
        return adeditTimeSheetREs;
      }));
  }

  deleteTimeSheetById(timeSheetId: number, userId: number) {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveTimesheet/${timeSheetId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteTimeSheetRes => {
        return deleteTimeSheetRes;
      }));
  }

  exportToExcelTimesheet(timeSheetIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, timeSheetIds, httpOption)
      .pipe(map(excelFileRes => {
        return excelFileRes;
      }));
  }

  deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleTimesheets`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }

  insertMultipleEmployeeTimesheetDetails(timesheetObj: any): Observable<AddEmployeeTimesheetRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}InsertMultipleTimesheets`;
    return this.http.post<AddEmployeeTimesheetRequest[]>(serviceUrl, timesheetObj, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
}
