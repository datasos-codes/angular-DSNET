import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeeAddressRequest } from '../../../../models/employeeaddressrequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
})
export class AddressListComponent implements OnInit {
  @Input() employeeId: any;
  @ViewChild('addresstable') addresstable: Table;

  employeeAddressData: any = [];
  selectedAddressForCheckBox: EmployeeAddressRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  editAddressData: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  addressListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) {
  }

  ngOnInit() {
    this.getLocalStoragePermissionData();
    this.getEmployeeAddressDetails(true);
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_ADDRESS_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeAddressDetails(isNeedToRefresh: boolean): void {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(this.employeeId, isNeedToRefresh).pipe(first()).subscribe(employeeAddressResponse => {
        if (employeeAddressResponse && (employeeAddressResponse['flag'] === 1)) {
          this.employeeAddressData = employeeAddressResponse['data']['address'];
        }
      }, error => {
        console.log(error);
      });
    }
  }

  showConfirmForDeleteAddress(deleteAddressData: any) {
    if (deleteAddressData && deleteAddressData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteAddresskey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteAddressData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteAddressDetails(addressData: any) {
    this.messageService.clear('deleteAddresskey');
    if (addressData && addressData.length > 0) {
      this.deleteMultipleAddress(addressData);
    } else if (addressData && addressData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleAddress(addressData, loggedInUserId);
    }
  }

  private deleteMultipleAddress(addressDataForDelete: any) {
    const addressIds = addressDataForDelete.map((addressId: { id: any; }) => addressId.id);
    this.deleteMultipleParams = { Ids: addressIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedAddressIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleAddressRes => {
      if (deleteMultipleAddressRes && deleteMultipleAddressRes['flag'] === 1) {
        this.selectedAddressForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleAddressRes['message']
        });
        this.getEmployeeAddressDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleAddressRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleAddress(addressData: any, loggedInUserId: any) {
    this.employeeApi.deleteAddressById(addressData, loggedInUserId).pipe(first()).subscribe(deleteAddressRes => {
      if (deleteAddressRes && deleteAddressRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteAddressRes['message']
        });
        this.getEmployeeAddressDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteAddressRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedAddressForCheckBox && this.selectedAddressForCheckBox.length > 0) {
      this.selectedAddressForCheckBox = [];
    }
    this.messageService.clear('deleteAddresskey');
  }

  openAddEditDialog(addressObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = addressObj === undefined ? 'Add Address' : 'Edit Address';
    this.addressListObj = addressObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeAddressDetails(true);
    }
  }
}
