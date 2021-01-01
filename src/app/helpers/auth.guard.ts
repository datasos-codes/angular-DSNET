import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService, AlertMessageService } from '../services';
import { OrganizationApi, RoleBasePermission, UrlsPermission } from '../shared';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    options = {
        autoClose: true,
        keepAfterRouteChange: false
    };
    errorMsg = `<h5 class="alert-heading">Warning!</h5> <p class="mb-0">Access denied.</p>`;
    roleId: any;
    permissionsData: any;
    isAdminOrNOt: boolean;
    checkRoles: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertMessageService: AlertMessageService,
        private organizationApi: OrganizationApi
    ) {
        this.getRoles();
        this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    }

    getRoles() {
        this.organizationApi.getUserRoles().subscribe(res => {
            if (res && (res['flag'] === 1)) {
                this.checkRoles = res['data'].map(id => id.id);
            }
        }, error => {
            console.log(error);
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser['flag'] === 1 && currentUser['data'] && currentUser['data'] !== '') {
            // check if route is restricted by role
            if (this.checkRoles && this.checkRoles.indexOf(currentUser['data']['roleId']) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                this.alertMessageService.error(this.errorMsg, this.options);
                return false;
            }

            this.checkPermissionForThisUrls(state.url);
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }

    checkPermissionForThisUrls(url: any) {
        if (url === UrlsPermission.DASHBOARD) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.DASHBOARD_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.EMPLOYEE) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.EMPLOYEES_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.ADDEMPLOYEE) {
            setTimeout(() => {
                this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                    if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                        this.permissionsData = rolePermissionRes['data']['permissions'].
                            filter(fname => fname.featureName === RoleBasePermission.EMPLOYEES_SCREEN)[0].features.allowedAddButton;
                        if (this.permissionsData === false) {
                            this.router.navigate(['/dashboard']);
                            this.alertMessageService.error(this.errorMsg, this.options);
                            return false;
                        }
                    }
                });
            }, 200);
        } else if (url.indexOf(UrlsPermission.EDITEMPLOYEE) > -1) {
            setTimeout(() => {
                this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                    if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                        this.permissionsData = rolePermissionRes['data']['permissions'].
                            filter(fname => fname.featureName === RoleBasePermission.EMPLOYEES_SCREEN)[0].features.allowedEditButton;
                        if (this.permissionsData === false) {
                            this.router.navigate(['/dashboard']);
                            this.alertMessageService.error(this.errorMsg, this.options);
                            return false;
                        }
                    }
                });
            }, 300);
        } else if (url.indexOf(UrlsPermission.VIEWEMPLOYEEPERSONALDETAILS) > -1) {
            // setTimeout(() => {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.EMPLOYEES_SCREEN)[0].features.allowedViewButton;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
            // }, 300);
        } else if (url === UrlsPermission.ATTENDANCES) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.ATTENDANCES_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.LEAVES) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.LEAVES_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.TIMESHEETS) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.TIMESHEETS_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.CUSTOMERS) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.CUSTOMERS_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.HOLIDAYS) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.HOLIDAYS_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.INVOICES) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.INVOICE_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.DOCUMENTS) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.DOCUMENTS_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.DESIGNATIONS) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.DESIGNATIONS_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        } else if (url === UrlsPermission.PROJECTS) {
            this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
                if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
                    this.permissionsData = rolePermissionRes['data']['permissions'].
                        filter(fname => fname.featureName === RoleBasePermission.PROJECTS_SCREEN)[0].allowed;
                    if (this.permissionsData === false) {
                        this.router.navigate(['/dashboard']);
                        this.alertMessageService.error(this.errorMsg, this.options);
                        return false;
                    }
                }
            });
        }
    }

}
