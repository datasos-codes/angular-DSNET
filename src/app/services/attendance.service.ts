import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { AttendanceRequest } from '../models';
import { AttendanceApi } from '../shared';
import { Observable } from 'rxjs';
import { AuthenticationService } from '.';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService implements AttendanceApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
};
  private baseUrl: string = environment.baseUrl;
  private controllerName: string = '/Admin/Attendance/';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  geAllAttendanceList(filterObj): Observable<AttendanceRequest[]> {
    const serviceUrl: string = `${this.baseUrl}${this.controllerName}Attendance`;
    return this.http.post<AttendanceRequest[]>(serviceUrl, filterObj , { headers: this.headers })
      .pipe(map(attendanceRes => {
        return attendanceRes;
      }));
  }

  addEditAttendanceDetails(attendanceObj): Observable<AttendanceRequest[]> {
    const serviceUrl: string = `${this.baseUrl}${this.controllerName}UpsertAttendance`;
    return this.http.post<AttendanceRequest[]>(serviceUrl, attendanceObj, { headers: this.headers })
      .pipe(map(addeditAttendanceRes => {
        return addeditAttendanceRes;
      }));
  }

  deleteAttendanceById(attendanceId: number, userId: number) {
    const serviceUrl: string = `${this.baseUrl}${this.controllerName}RemoveAttendance/${attendanceId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteAttendanceRes => {
        return deleteAttendanceRes;
      }));
  }

  exportToExcelAttendance(attendanceIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, attendanceIds, httpOption)
      .pipe(map(excelFileRes => {
        return excelFileRes;
      }));
  }

  deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleAttendances`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
}
