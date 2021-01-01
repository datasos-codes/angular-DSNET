import { ChangePassword } from './../models/changepassword';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Role } from '../models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public headers: any = { 'content-type': 'application/json' };
    private baseUrl: string = environment.baseUrl;
    private controllerName = '/Login/';
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    loggedInUserData: any;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        if (this.currentUserSubject.value) {
            return this.currentUserSubject.value;
        } else {
            this.router.navigate(['/login']);
        }
    }

    login(loginData: any): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}Login`;
        return this.http.post<any>(serviceUrl, loginData, { headers: this.headers }).pipe(
            map(user => {
                // login successful if there's a jwt Token in the response
                if (user && user['token']) {
                    // store user details and jwt Token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            })
        );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    changePassword(changePasswordData: any): Observable<ChangePassword[]> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}ChangePassword`;
        return this.http.post<ChangePassword[]>(serviceUrl, changePasswordData, { headers: this.headers }).pipe(
            map(userChangePswdData => {
                return userChangePswdData;
            })
        );
    }

    IsUserId(): any {
        this.loggedInUserData = this.currentUserValue;
        if (this.loggedInUserData && this.loggedInUserData['flag'] === 1 &&
            this.loggedInUserData['data'] && this.loggedInUserData['data'] !== '') {
            return this.loggedInUserData['data']['employeeId'];
        } else {
            return null;
        }
    }

    isLoggedIn() {
        const authHeader = this.currentUserValue['token'] || '';
        return (authHeader !== '' ? true : false);
    }

    isAdmin() {
        return this.isLoggedIn() && this.currentUserValue['data']['roleId'] === Role.Admin;
    }

    isHR() {
        return this.isLoggedIn() && this.currentUserValue['data']['roleId'] === Role.HR;
        // this.role();
    }

    getRoleBasePermissionData() {
        const permissionDetails = JSON.parse(localStorage.getItem('currentUser'));
        if (permissionDetails['permissions'] && permissionDetails['permissions'].length > 0) {
            return permissionDetails['permissions'];
        }
    }

    // role() {
    //     const roleHeaders: any = {
    //         'content-type': 'application/json',
    //         'Token': 'Bearer ' + this.currentUserValue['token']
    //     };
    //     const serviceUrl = `${this.baseUrl}/Organization/GetRoles`;
    //     return this.http.get<any[]>(serviceUrl, { headers: roleHeaders }).pipe(
    //         map(userRolesRes => {
    //             console.log('userRolesRes', userRolesRes);
    //             return userRolesRes;
    //         })
    //     );
    // }
}
