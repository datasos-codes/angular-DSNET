import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeeSalaryRequest } from '../../../../models/employeesalaryrequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table/table';
import * as moment from 'moment';

@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  @Input() employeeId: any;
  @ViewChild('salarytable') salarytable: Table;

  employeeSalaryData: any = [];
  selectedSalaryForCheckBox: EmployeeSalaryRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal: boolean;
  displayHeader: string;
  salaryListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.getEmployeeSalaryDetails(true);
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_SALARY_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeSalaryDetails(isNeedToRefresh: boolean) {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(parseInt(this.employeeId, 10), isNeedToRefresh)
        .pipe(first()).subscribe(employeeSalaryResponse => {
          if (employeeSalaryResponse && (employeeSalaryResponse['flag'] === 1)) {
            this.employeeSalaryData = employeeSalaryResponse['data']['salary'];
          }
        }, error => {
          console.log(error);
        });
    }
  }

  showConfirmForDeleteSalary(deleteSalaryData: any) {
    if (deleteSalaryData && deleteSalaryData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteSalarykey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteSalaryData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteSalaryDetails(salaryData: any) {
    this.messageService.clear('deleteSalarykey');
    if (salaryData && salaryData.length > 0) {
      this.deleteMultipleSalary(salaryData);
    } else if (salaryData && salaryData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleSalary(salaryData, loggedInUserId);
    }
  }

  private deleteMultipleSalary(salaryDataForDelete: any) {
    const salaryIds = salaryDataForDelete.map((salaryId: { id: any; }) => salaryId.id);
    this.deleteMultipleParams = { Ids: salaryIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedSalaryIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleSalaryRes => {
      if (deleteMultipleSalaryRes && deleteMultipleSalaryRes['flag'] === 1) {
        this.selectedSalaryForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleSalaryRes['message']
        });
        this.getEmployeeSalaryDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleSalaryRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleSalary(salaryData: any, loggedInUserId: any) {
    this.employeeApi.deleteSalaryById(salaryData, loggedInUserId).pipe(first()).subscribe(deleteSalaryRes => {
      if (deleteSalaryRes && deleteSalaryRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteSalaryRes['message']
        });
        this.getEmployeeSalaryDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteSalaryRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedSalaryForCheckBox && this.selectedSalaryForCheckBox.length > 0) {
      this.selectedSalaryForCheckBox = [];
    }
    this.messageService.clear('deleteSalarykey');
  }

  openAddEditDialog(salaryObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = salaryObj === undefined ? 'Add Salary' : 'Edit Salary';
    this.salaryListObj = salaryObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeSalaryDetails(true);
    }
  }

  customSortForSalaryTable(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        const test = value1.substr(2, 1);
        const date1 = moment(value1, 'DD-MMM-YYYY');
        const date2 = moment(value2, 'DD-MMM-YYYY');
        if (test === '-' || test === '/') {
          result = date1.diff(date2, 'days');
        } else {
          result = value1.localeCompare(value2);
        }
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }
}
