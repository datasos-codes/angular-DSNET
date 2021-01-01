import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NamesApiRequest } from '../models';
import { DepartmentApi } from '../shared/api';
import { AuthenticationService } from '.';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService implements DepartmentApi {

    public headers: any = {
        'content-type': 'application/json',
        'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    private baseUrl: string = environment.baseUrl;
    private controllerName = '/Admin/Department/';
    designationLists: NamesApiRequest[];

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getAllDepartmentsByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]> {
        if (this.designationLists && !isNeedToRefresh) {
            return of(this.designationLists);
        } else {
            const serviceUrl = `${this.baseUrl}${this.controllerName}GetDepartmentByNames`;
            return this.http.get<NamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
                map((designationRes) => {
                    this.designationLists = designationRes;
                    return this.designationLists;
                }), publishReplay(1), refCount(),
            );
        }
    }

}
