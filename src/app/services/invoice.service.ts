import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InvoiceAPi } from '../shared';
import { AuthenticationService } from '.';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService implements InvoiceAPi {

    public headers: any = {
        'content-type': 'application/json',
        'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    private baseUrl: string = environment.baseUrl;
    private controllerName = '/Admin/Invoice/';

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getAllInvoices(invoiceObjectData: any): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}GetInvoices`;
        return this.http.post<any>(serviceUrl, invoiceObjectData, { headers: this.headers }).pipe(
            map(res => {
                return res;
            })
        );
    }

    exportToExcelInvoicesData(invoiceExeclData: any): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
        const httpOption = {
            responseType: 'blob' as 'json',
            'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
        };
        return this.http.post<any>(serviceUrl, invoiceExeclData, httpOption)
            .pipe(map(res => {
                return res;
            }));
    }
}
