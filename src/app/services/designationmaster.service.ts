import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DesignationMasterRequest, NamesApiRequest } from '../models';
import { DesignationMasterApi } from '../shared';
import { AuthenticationService } from '.';

@Injectable({
  providedIn: 'root'
})
export class DesignationmasterService implements DesignationMasterApi {

  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl: string = environment.baseUrl;
  private controllerName = '/Admin/Designation/';
  designationLists: NamesApiRequest[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllEmployeeDesignation(): Observable<DesignationMasterRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}Designation`;
    return this.http.get<DesignationMasterRequest[]>(serviceUrl, { headers: this.headers })
      .pipe(map(empDesignationResponse => {
        return empDesignationResponse;
      }));
  }

  getAllDesignationsByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]> {
    if (this.designationLists && !isNeedToRefresh) {
      return of(this.designationLists);
    } else {
      const serviceUrl = `${this.baseUrl}${this.controllerName}GetDesignationByNames`;
      return this.http.get<NamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
        map((designationRes) => {
          this.designationLists = designationRes;
          return this.designationLists;
        }), publishReplay(1), refCount(),
      );
    }
  }

  addEditDesignationDetails(designationObj: any): Observable<DesignationMasterRequest[]> {
    const serviceUrl: string = `${this.baseUrl}${this.controllerName}UpsertDesignation`;
    return this.http.post<DesignationMasterRequest[]>(serviceUrl, designationObj, { headers: this.headers })
      .pipe(map(empDesignationResponse => {
        return empDesignationResponse;
      }));
  }

  deleteDesignationById(designationId: number, userId: number) {
    const serviceUrl: string = `${this.baseUrl}${this.controllerName}RemoveDesignation/${designationId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteDesignationRes => {
        return deleteDesignationRes;
      }));
  }

  exportToExcelDesignation(designationIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, designationIds, httpOption)
      .pipe(map(excelFileRes => {
        return excelFileRes;
      }));
  }

  deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleDesignations`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
}
