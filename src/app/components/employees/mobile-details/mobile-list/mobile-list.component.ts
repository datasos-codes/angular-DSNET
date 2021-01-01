import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeeMobileRequest } from '../../../../models/employeemobilerequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-mobile-list',
  templateUrl: './mobile-list.component.html',
  styleUrls: ['./mobile-list.component.css']
})
export class MobileListComponent implements OnInit {
  @Input() employeeId;
  @ViewChild('mobiletable') mobiletable: Table;

  employeePhoneData: any = [];
  selectedMobileForCheckBox: EmployeeMobileRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  mobileListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit() {
    this.getLocalStoragePermissionData();
    this.getEmployeeMobileDetails(true);
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_MOBILE_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeMobileDetails(isNeedToRefresh: boolean): void {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(this.employeeId, isNeedToRefresh).pipe(first()).subscribe(employeePhoneResponse => {
        if (employeePhoneResponse && (employeePhoneResponse['flag'] === 1)) {
          this.employeePhoneData = employeePhoneResponse['data']['phone'];
        }
      }, error => {
        console.log(error);
      });
    }
  }

  showConfirmForDeleteMobile(deleteMobileData: any) {
    if (deleteMobileData && deleteMobileData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteMobilekey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteMobileData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteMobileDetails(mobileData: any) {
    this.messageService.clear('deleteMobilekey');
    if (mobileData && mobileData.length > 0) {
      this.deleteMultipleMobile(mobileData);
    } else if (mobileData && mobileData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleMobile(mobileData, loggedInUserId);
    }
  }

  private deleteMultipleMobile(mobileDataForDelete: any) {
    const mobileIds = mobileDataForDelete.map((mobileId: { id: any; }) => mobileId.id);
    this.deleteMultipleParams = { Ids: mobileIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedMobileIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleMobileRes => {
      if (deleteMultipleMobileRes && deleteMultipleMobileRes['flag'] === 1) {
        this.selectedMobileForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleMobileRes['message']
        });
        this.getEmployeeMobileDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleMobileRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleMobile(mobileData: any, loggedInUserId: any) {
    this.employeeApi.deleteMobileById(mobileData, loggedInUserId).pipe(first()).subscribe(deleteMobileRes => {
      if (deleteMobileRes && deleteMobileRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMobileRes['message']
        });
        this.getEmployeeMobileDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMobileRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedMobileForCheckBox && this.selectedMobileForCheckBox.length > 0) {
      this.selectedMobileForCheckBox = [];
    }
    this.messageService.clear('deleteMobilekey');
  }

  openAddEditDialog(mobileObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = mobileObj === undefined ? 'Add Mobile' : 'Edit Mobile';
    this.mobileListObj = mobileObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeMobileDetails(true);
    }
  }
}
