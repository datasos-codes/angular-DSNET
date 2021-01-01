import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeeBankAccountRequest } from '../../../../models/employeebankaccountrequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit {
  @Input() employeeId: any;
  @ViewChild('banktable') banktable: Table;

  employeeBankAccountData: any = [];
  selectedBankAccountForCheckBox: EmployeeBankAccountRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal: boolean;
  displayHeader: string;
  bankListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi
  ) { }

  ngOnInit(): void {
    this.getEmployeeBankAccDetails(true);
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_BANK_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeBankAccDetails(isNeedToRefresh: boolean) {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(parseInt(this.employeeId, 10), isNeedToRefresh)
        .pipe(first()).subscribe(employeeBankAccountResponse => {
          if (employeeBankAccountResponse && (employeeBankAccountResponse['flag'] === 1)) {
            this.employeeBankAccountData = employeeBankAccountResponse['data']['employeeBankAccount'];
          }
        }, error => {
          console.log(error);
        });
    }
  }

  showConfirmForDeleteBankAccount(deleteBankData: any) {
    if (deleteBankData && deleteBankData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteBankAccountkey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteBankData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteBankAccountDetails(bankData: any) {
    this.messageService.clear('deleteBankAccountkey');
    if (bankData && bankData.length > 0) {
      this.deleteMultipleBankAccount(bankData);
    } else if (bankData && bankData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleBankAccount(bankData, loggedInUserId);
    }
  }

  private deleteMultipleBankAccount(bankDataForDelete: any) {
    const bankIds = bankDataForDelete.map((bankId: { id: any; }) => bankId.id);
    this.deleteMultipleParams = { Ids: bankIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedBankAccountIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleBankRes => {
      if (deleteMultipleBankRes && deleteMultipleBankRes['flag'] === 1) {
        this.selectedBankAccountForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleBankRes['message']
        });
        this.getEmployeeBankAccDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleBankRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleBankAccount(bankData: any, loggedInUserId: any) {
    this.employeeApi.deleteBankAccountById(bankData, loggedInUserId).pipe(first()).subscribe(deleteBankRes => {
      if (deleteBankRes && deleteBankRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteBankRes['message']
        });
        this.getEmployeeBankAccDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteBankRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedBankAccountForCheckBox && this.selectedBankAccountForCheckBox.length > 0) {
      this.selectedBankAccountForCheckBox = [];
    }
    this.messageService.clear('deleteBankAccountkey');
  }

  openAddEditDialog(bankObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = bankObj === undefined ? 'Add Bank' : 'Edit Bank';
    this.bankListObj = bankObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeBankAccDetails(true);
    }
  }

}
