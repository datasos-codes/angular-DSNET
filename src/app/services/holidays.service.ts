import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HolidaysRequest } from '../models';
import { HolidaysApi } from '../shared/api';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService implements HolidaysApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl = environment.baseUrl;
  private controllerName = '/Admin/Holiday/';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllHolidayListByYear(year: any): Observable<HolidaysRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}Holiday/${year}`;
    return this.http.get<HolidaysRequest[]>(serviceUrl, { headers: this.headers }).pipe(map(holidayRes => {
      return holidayRes;
    }));
  }

  addEditholidaysObjDetails(holidaysObj: any): Observable<HolidaysRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertHoliday`;
    return this.http.post<HolidaysRequest[]>(serviceUrl, holidaysObj, { headers: this.headers })
      .pipe(map(addEditholidayRes => {
        return addEditholidayRes;
      }));
  }

  deleteHolidayById(holidayId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveHoliday/${holidayId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteHolidayRes => {
        return deleteHolidayRes;
      }));
  }

  exportToExcelHoliday(holidayIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, holidayIds, httpOption)
      .pipe(map(excelFileRes => {
        return excelFileRes;
      }));
  }

  deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleHolidays`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
}
