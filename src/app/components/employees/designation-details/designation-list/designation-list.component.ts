import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeeDesignationRequest } from '../../../../models/employeedesignationrequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService, SortEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.css']
})
export class DesignationListComponent implements OnInit {
  @Input() employeeId: number = 0;
  @ViewChild('designationTable') designationTable: Table;

  designationData: any = [];
  selectedEmpDesignationForCheckBox: EmployeeDesignationRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  designationListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit() {
    this.getEmployeeDesignationDetails(true);
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_DESIGNATION_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeDesignationDetails(isNeedToRefresh: boolean) {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(this.employeeId, isNeedToRefresh).pipe(first()).subscribe(employeeDesignationListResponse => {
        if (employeeDesignationListResponse && (employeeDesignationListResponse['flag'] === 1)) {
          this.designationData = employeeDesignationListResponse['data']['empDesignations'];
        }
      }, error => {
        console.log(error);
      });
    }
  }

  showConfirmForDeleteEmpDesignation(deleteDesignationData: any) {
    if (deleteDesignationData && deleteDesignationData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteDesignationkey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteDesignationData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteDesignationDetails(designationData: any) {
    this.messageService.clear('deleteDesignationkey');
    if (designationData && designationData.length > 0) {
      this.deleteMultipleDesignation(designationData);
    } else if (designationData && designationData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleDesignation(designationData, loggedInUserId);
    }
  }

  private deleteMultipleDesignation(designationDataForDelete: any) {
    const designationIds = designationDataForDelete.map((designationId: { id: any; }) => designationId.id);
    this.deleteMultipleParams = { Ids: designationIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedDesignationIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleDesignationRes => {
      if (deleteMultipleDesignationRes && deleteMultipleDesignationRes['flag'] === 1) {
        this.selectedEmpDesignationForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleDesignationRes['message']
        });
        this.getEmployeeDesignationDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleDesignationRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleDesignation(designationData: any, loggedInUserId: any) {
    this.employeeApi.deleteDesignationById(designationData, loggedInUserId).pipe(first()).subscribe(deleteEmpRes => {
      if (deleteEmpRes && deleteEmpRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteEmpRes['message']
        });
        this.getEmployeeDesignationDetails(true);
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
    if (this.selectedEmpDesignationForCheckBox && this.selectedEmpDesignationForCheckBox.length > 0) {
      this.selectedEmpDesignationForCheckBox = [];
    }
    this.messageService.clear('deleteDesignationkey');
  }

  openAddEditDialog(designationObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = designationObj === undefined ? 'Add Designation' : 'Edit Designation';
    this.designationListObj = designationObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeDesignationDetails(true);
    }
  }

  customSortForDesignationTable(event: SortEvent) {
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
