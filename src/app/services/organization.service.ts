import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { PermissionsRequest } from '../models';
import { OrganizationApi } from '../shared';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService implements OrganizationApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  refreshnavItemsForAllRoles = new BehaviorSubject<any>(false);
  private baseUrl: string = environment.baseUrl;
  private controllerName = '/Organization/';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getUserRoles(): Observable<PermissionsRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetRoles`;
    return this.http.get<PermissionsRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map(userRolesRes => {
        return userRolesRes;
      }));
  }

  getRolePermission(permissionId: number): Observable<PermissionsRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetRolePermissions/${permissionId}`;
    return this.http.get<PermissionsRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map(rolePermissionRes => {
        return rolePermissionRes;
      }));
  }

  updateRoleWisePermissions(permissionObj: any): Observable<any[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpdateRolePermissions`;
    return this.http.post<any[]>(serviceUrl, permissionObj, { headers: this.headers })
      .pipe(map(updatePermissionsRes => {
        return updatePermissionsRes;
      }));
  }
}
