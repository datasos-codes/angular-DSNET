import { RoleBasePermission } from './../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services';
import { first } from 'rxjs/operators';
import { EmployeeRequest } from '../../models/employeerequest';
import { Router } from '@angular/router';
import { Table } from 'primeng/table/table';
import { MessageService, SortEvent } from 'primeng/api';
import { EmployeeApi, OrganizationApi } from '../../shared/api';
import * as moment from 'moment';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  @ViewChild('employeetable') employeetable: Table;

  employeeData: any;
  selectedCheckBoxForEmployees: EmployeeRequest[];
  deleteMultipleParams: { Ids: any; loggedInUserId: any; };
  employeeModulePermission: any;
  roleId: any;
  loggedInUserIDs: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private router: Router,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private organizationApi: OrganizationApi
  ) { }

  ngOnInit(): void {
    this.loggedInUserIDs = this.authenticationService.IsUserId();
    this.getAllEmployeesList();
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.employeeModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEES_SCREEN)[0];
        if (this.employeeModulePermission && this.employeeModulePermission !== undefined) {
          this.employeeModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getAllEmployeesList() {
    this.employeeApi.getAllEmployees().pipe(first()).subscribe(employeeRes => {
      if (employeeRes && employeeRes['flag'] === 1) {
        this.employeeData = employeeRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  viewEmployeeDetails(employeeId: number) {
    this.router.navigate(['/employees/viewemployee', employeeId]);
  }

  openAddEditEmployeeDialog() {
    this.router.navigate(['/employees/addemployee']);
  }

  editEmployeeDetails(employeeId: number) {
    this.router.navigate(['/employees/editemployee', employeeId]);
  }

  exportExcelEmployees(employeeArgs: any) {
    if (employeeArgs && employeeArgs.length > 0) {
      const employeeIds = employeeArgs.map((id: { employeeId: any; }) => id.employeeId);
      this.employeeApi.exportToExcelEmployees(employeeIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Employees';
        link.click();
        this.selectedCheckBoxForEmployees = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteEmployees(deleteEmployeeData: any) {
    if (deleteEmployeeData && deleteEmployeeData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteEmployeeKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteEmployeeData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteEmployeeDetails(employeeData: any) {
    this.messageService.clear('deleteEmployeeKey');
    if (employeeData && employeeData.length > 0) {
      this.deleteMultipleEmployees(employeeData);
    } else if (employeeData && employeeData !== 0) {
      const loggedInUserId = this.loggedInUserIDs;
      this.deleteSingleemployee(employeeData, loggedInUserId);
    }
  }

  private deleteMultipleEmployees(employeeDataForDelete: any) {
    const employeeIds = employeeDataForDelete.map((id: { employeeId: any; }) => id.employeeId);
    this.deleteMultipleParams = { Ids: employeeIds, loggedInUserId: this.loggedInUserIDs };
    this.employeeApi.deletedSelectedEmployeeIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedCheckBoxForEmployees = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllEmployeesList();
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

  private deleteSingleemployee(employeeId: number, loggedInUserId: number) {
    this.employeeApi.deleteEmployeeById(employeeId, loggedInUserId).pipe(first()).subscribe(deleteEmpRes => {
      if (deleteEmpRes && deleteEmpRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteEmpRes['message']
        });
        this.getAllEmployeesList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteEmpRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedCheckBoxForEmployees && this.selectedCheckBoxForEmployees.length > 0) {
      this.selectedCheckBoxForEmployees = [];
    }
    this.messageService.clear('deleteEmployeeKey');
  }

  customSortForEmployeeTable(event: SortEvent) {
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
