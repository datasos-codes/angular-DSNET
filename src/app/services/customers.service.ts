import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { CustomersRequest, NamesApiRequest } from '../models';
import { CustomersApi } from '../shared';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class CustomersService implements CustomersApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl: string = environment.baseUrl;
  private controllerName = '/Admin/Customer/';
  customerNames: NamesApiRequest[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllCustomersList(): Observable<CustomersRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}Customer`;
    return this.http.get<CustomersRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map(customersRes => {
        return customersRes;
      }));
  }

  getAllCustomersByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]> {
    if (this.customerNames && !isNeedToRefresh) {
      return of(this.customerNames);
    } else {
      const serviceUrl = `${this.baseUrl}${this.controllerName}CustomerByName`;
      return this.http.get<NamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
        map((customersRes) => {
          this.customerNames = customersRes;
          return this.customerNames;
        }), publishReplay(1), refCount(),
      );
    }
  }

  addEditCustomerDetails(customerObj: any): Observable<CustomersRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertCustomers`;
    return this.http.post<CustomersRequest[]>(serviceUrl, customerObj, { headers: this.headers })
      .pipe(map(addeditCustomerRes => {
        return addeditCustomerRes;
      }));
  }

  exportToExcelCustomer(customerIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, customerIds, httpOption)
      .pipe(map(excelFileRes => {
        return excelFileRes;
      }));
  }

  deleteCustomerById(customerId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveCustomers/${customerId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteCustomerRes => {
        return deleteCustomerRes;
      }));
  }

  deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleCustomers`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }

}
