import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, OrganizationService } from '../../../services';
import { first } from 'rxjs/operators';
import { CustomersRequest } from '../../../models/customersrequest';
import { CustomersApi, OrganizationApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {
  @ViewChild('customertable') customertable: Table;

  customersData: any = [];
  selectedCustomerForCheckBox: CustomersRequest[];
  deleteMultipleParams: any;
  customerModulePermission: any;
  getRolePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  customerListObj: any;
  dynamicButtonsobj: any = {};
  permissionRes: void;

  constructor(
    private customersApi: CustomersApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
    private organizationService: OrganizationService
  ) { }

  ngOnInit(): void {
    this.getAllCustomersList();
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.customerModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.CUSTOMERS_SCREEN)[0];
        if (this.customerModulePermission && this.customerModulePermission !== undefined) {
          this.getRolePermission = this.customerModulePermission.features;
          this.customerModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getAllCustomersList() {
    this.customersApi.getAllCustomersList().pipe(first()).subscribe(customersRes => {
      if (customersRes && customersRes['flag'] === 1) {
        this.customersData = customersRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  exportExcelCustomers(customerArgs: any) {
    if (customerArgs && customerArgs.length > 0) {
      const customerIds = customerArgs.map((customerId: { id: any; }) => customerId.id);
      this.customersApi.exportToExcelCustomer(customerIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Customers';
        link.click();
        this.selectedCustomerForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteCustomers(deleteCustomerData: any) {
    if (deleteCustomerData && deleteCustomerData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteCustomerKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteCustomerData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteCustomerDetails(customerData: any) {
    this.messageService.clear('deleteCustomerKey');
    if (customerData && customerData.length > 0) {
      this.deleteMultipleCustomers(customerData);
    } else if (customerData && customerData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleCustomer(customerData, loggedInUserId);
    }
  }

  private deleteMultipleCustomers(customerDataForDelete: any) {
    const customerIds = customerDataForDelete.map((customerId: { id: any; }) => customerId.id);
    this.deleteMultipleParams = { Ids: customerIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.customersApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedCustomerForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllCustomersList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: res['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleCustomer(customerData: any, loggedInUserId: any) {
    this.customersApi.deleteCustomerById(customerData, loggedInUserId).pipe(first()).subscribe(deleteCustomerRes => {
      if (deleteCustomerRes && deleteCustomerRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteCustomerRes['message']
        });
        this.getAllCustomersList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteCustomerRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedCustomerForCheckBox && this.selectedCustomerForCheckBox.length > 0) {
      this.selectedCustomerForCheckBox = [];
    }
    this.messageService.clear('deleteCustomerKey');
  }

  showCustomerDialog(customerObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = customerObj === undefined ? 'Add Customer' : 'Edit Customer';
    this.customerListObj = customerObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getAllCustomersList();
    }
  }
}
