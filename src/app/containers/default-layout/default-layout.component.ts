import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, NotificationService, EmployeeService, OrganizationService } from '../../services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationsApi, OrganizationApi } from '../../shared/api';
import { RoleBasePermission } from '../../shared/constances/rolebasepermission';
import { environment } from './../../../environments/environment';
import { Role } from '../../models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit {
  @ViewChild('changepswdmodal') public changepswdmodal: ModalDirective;
  public sidebarMinimized = false;
  public navItems: any = [];
  loggedInUserDataId: number;
  localstorageData: any;
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  isAdminOrNOt: boolean;
  notificationArr: any = [];
  NotificationCount: number;
  loginUserProfileImage: any;
  updateImageTime = Date.now();
  isGender: number;
  roleId: number;
  roleWisePermissions: any;
  permissionsData: any;
  loginUserName: string;
  loginUserdesignation: string;
  isNeedToRenderUIModal = false;
  displayHeader: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private notificationsApi: NotificationsApi,
    private employeeService: EmployeeService,
    private organizationApi: OrganizationApi,
    private organizationService: OrganizationService,
    private messageService: MessageService,
  ) {
    this.loggedInUserDataId = this.authenticationService.IsUserId();
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
  }

  ngOnInit() {
    const loginUserData = this.authenticationService.currentUserValue['data'];
    this.loginUserName = loginUserData.firstName + ' ' + loginUserData.middleName + ' ' + loginUserData.lastName;
    this.loginUserdesignation = loginUserData.designationName;

    if (this.loggedInUserDataId && this.loggedInUserDataId > 0) {
      this.isAdminOrNOt = this.authenticationService.isAdmin();
      this.isModuleVisible();
    }

    this.getAllNotificationList(true);
    this.notificationService.refreshNotification.subscribe(res => {
      if (res) {
        this.getAllNotificationList(true);
      }
    });

    this.getProfileImage();
    this.employeeService.refreshProfileImage.subscribe(profileImgRes => {
      if (profileImgRes) {
        this.getProfileImage();
      }
    });

    this.organizationService.refreshnavItemsForAllRoles.subscribe(res => {
      if (res) {
        this.isModuleVisible();
      }
    });
  }

  isModuleVisible() {
    const adminNavItemsArr = [];
    this.organizationApi.getRolePermission(this.roleId).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.permissionsData = rolePermissionRes['data']['permissions'];
        if (this.permissionsData && this.permissionsData.length > 0) {
          const filterPermissionArr = [];
          this.permissionsData.forEach(permissionData => {
            if (permissionData.featureName === RoleBasePermission.HOLIDAYS_SCREEN ||
              permissionData.featureName === RoleBasePermission.LEAVES_SCREEN ||
              permissionData.featureName === RoleBasePermission.ATTENDANCES_SCREEN ||
              permissionData.featureName === RoleBasePermission.TIMESHEETS_SCREEN ||
              permissionData.featureName === RoleBasePermission.PROJECTS_SCREEN ||
              permissionData.featureName === RoleBasePermission.CUSTOMERS_SCREEN ||
              permissionData.featureName === RoleBasePermission.DESIGNATIONS_SCREEN ||
              permissionData.featureName === RoleBasePermission.EMPLOYEES_SCREEN ||
              permissionData.featureName === RoleBasePermission.DASHBOARD_SCREEN ||
              permissionData.featureName === RoleBasePermission.INVOICE_SCREEN ||
              permissionData.featureName === RoleBasePermission.DOCUMENTS_SCREEN) {
              filterPermissionArr.push(permissionData);
            }
          });

          filterPermissionArr.forEach(element => {
            const obj = {
              name: '',
              url: '',
              attributes: {},
              icon: ''
            };

            obj.name = element.featureTitle;
            obj.url = element.featureUrl;
            obj.icon = element.featureIcon;
            element.allowed === false ? obj.attributes['hidden'] = true : obj.attributes = {};

            adminNavItemsArr.push(obj);
          });

          if (this.isAdminOrNOt) {
            const obj1 = {
              name: 'Permissions',
              url: '/permissions',
              icon: 'fa fa-key'
            };
            adminNavItemsArr.push(obj1);
          }
          this.navItems = adminNavItemsArr;
        }
      }
    });
  }

  getAllNotificationList(isNeedToRefresh: boolean) {
    this.notificationsApi.getAllNotifications(this.loggedInUserDataId, isNeedToRefresh).subscribe(notificationListRes => {
      if (notificationListRes && notificationListRes['flag'] === 1) {
        this.notificationArr = notificationListRes['data'];
        this.NotificationCount = notificationListRes['data'].length;
      }
    });
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  userProfile() {
    if (this.isAdminOrNOt) {
      this.router.navigate(['/employees/editemployee', this.loggedInUserDataId]);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  getProfileImage() {
    this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
    this.isGender = this.localstorageData['data']['gender'];
    this.updateImageTime = Date.now();
    if (this.localstorageData['data']['path'].includes(environment.baseUrl)) {
      this.loginUserProfileImage = this.localstorageData['data']['path'];
    } else {
      this.loginUserProfileImage = '';
    }
  }

  showChangePasswordDialog() {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = 'Change Password';
    this.loggedInUserDataId = this.loggedInUserDataId;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
    this.localstorageData['data']['password'] = arg['data']['password'];
    localStorage.setItem('currentUser', JSON.stringify(this.localstorageData));
    this.messageService.add({
      key: 'commonMsg', severity: 'success', summary: 'Success Message',
      detail: arg['message']
    });
  }

}
