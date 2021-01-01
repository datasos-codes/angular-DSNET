import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService, EmployeeService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeeEmailRequest } from '../../../../models/employeeemailrequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.css']
})
export class EmailListComponent implements OnInit {
  @Input() employeeId: any;
  @ViewChild('emailtable') emailtable: Table;

  employeeEmailData: any = [];
  selectedEmailForCheckBox: EmployeeEmailRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  emailListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
    public employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.getLocalStoragePermissionData();
    this.getEmployeeEmailDetails(true);
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_EMAIL_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeEmailDetails(isNeedToRefresh: boolean) {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(this.employeeId, isNeedToRefresh).pipe(first()).subscribe(employeeEmailList => {
        if (employeeEmailList && (employeeEmailList['flag'] === 1)) {
          this.employeeEmailData = employeeEmailList['data']['email'];
        }
      }, error => {
        console.log(error);
      });
    }
  }

  showConfirmForDeleteEmail(deleteEmailData: any) {
    if (deleteEmailData && deleteEmailData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteEmailkey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteEmailData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteEmailDetails(emailData: any) {
    this.messageService.clear('deleteEmailkey');
    if (emailData && emailData.length > 0) {
      this.deleteMultipleEmail(emailData);
    } else if (emailData && emailData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleEmail(emailData, loggedInUserId);
    }
  }

  private deleteMultipleEmail(emailDataForDelete: any) {
    const emailIds = emailDataForDelete.map((emailId: { id: any; }) => emailId.id);
    this.deleteMultipleParams = { Ids: emailIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedEmailIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleEmailRes => {
      if (deleteMultipleEmailRes && deleteMultipleEmailRes['flag'] === 1) {
        this.selectedEmailForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleEmailRes['message']
        });
        this.getEmployeeEmailDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleEmailRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleEmail(emailData: any, loggedInUserId: any) {
    this.employeeApi.deleteEmployeeEmailById(emailData, loggedInUserId).pipe(first()).subscribe(deleteEmpEmailRes => {
      if (deleteEmpEmailRes && deleteEmpEmailRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteEmpEmailRes['message']
        });
        this.getEmployeeEmailDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteEmpEmailRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedEmailForCheckBox && this.selectedEmailForCheckBox.length > 0) {
      this.selectedEmailForCheckBox = [];
    }
    this.messageService.clear('deleteEmailkey');
  }

  openAddEditDialog(emailObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = emailObj === undefined ? 'Add Email' : 'Edit Email';
    this.emailListObj = emailObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeEmailDetails(true);
    }
  }
}
