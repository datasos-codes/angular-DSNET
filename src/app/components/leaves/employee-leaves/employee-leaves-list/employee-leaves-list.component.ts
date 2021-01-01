import { Component, OnInit, ViewChild } from '@angular/core';
import { SpinnerService, AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminLeaveApi, OrganizationApi, EmployeeApi } from '../../../../shared/api';
import { Table } from 'primeng/table/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Filter } from '../../../../models/filter';
import { DatePipe } from '@angular/common';
import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { AdminLeavesRequest } from '../../../../models/adminleavesrequest';
import { MessageService, SortEvent } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';
import * as moment from 'moment';

interface SelectedEmployees {
  label: number;
  value: number;
}

@Component({
  selector: 'app-employee-leaves-list',
  templateUrl: './employee-leaves-list.component.html',
  styleUrls: ['./employee-leaves-list.component.css']
})
export class EmployeeleavesListComponent implements OnInit {
  @ViewChild('addEmployeeLeaveModal') public addEmployeeLeaveModalDialog: ModalDirective;
  @ViewChild('employeeleavestable') employeeleavestable: Table;

  employeeSideLeaveData: any = [];
  filterFrm: FormGroup;
  selectedEmployeeLeaveForCheckBox: AdminLeavesRequest[];
  filterObj = new Filter();
  loginEmployeeId: number;
  leaveModulePermission: any;
  getRolePermission: any;
  roleId: any;
  deleteMultipleParams: any;
  LeaveStatusTypes: any;
  selectedLeaveStatusType: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  addviewLeaveDetails: any;
  dynamicButtonsobj: any = {};
  UserId: any;
  selectedEmployees: SelectedEmployees;
  employeeList: any;

  constructor(
    private adminLeaveApi: AdminLeaveApi,
    private spinnerService: SpinnerService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private organizationApi: OrganizationApi,
    private messageService: MessageService,
    private employeeApi: EmployeeApi,
  ) { }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.leavesFilterControls();
    this.getEmployeeByFullNames();
    this.getLocalStoragePermissionData();
    this.getAllLeavesList();
  }

  getDropDownNamesByTypes() {
    this.employeeApi.getDropDownNamesByType().subscribe(dropdownNameRes => {
      if (dropdownNameRes && dropdownNameRes['flag'] === 1) {
        if (dropdownNameRes['data'] && dropdownNameRes['data'].length > 0) {
          dropdownNameRes['data'].map((data) => {
            data.label = data.displayName;
            data.value = data.displayValue;
          });
          this.LeaveStatusTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.LEAVESTATUSTYPE);
          this.selectedLeaveStatusType = this.LeaveStatusTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.leaveModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.LEAVES_SCREEN)[0];
        if (this.leaveModulePermission && this.leaveModulePermission !== undefined) {
          this.leaveModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  private leavesFilterControls() {
    this.filterFrm = this.formBuilder.group({
      Id: [''],
      range: [''],
      status: ['']
    });
  }

  getEmployeeByFullNames(): void {
    this.employeeApi.getAllUsersByNames().pipe(first()).subscribe(employeeRes => {
      if (employeeRes && employeeRes['flag'] === 1) {
        this.employeeList = employeeRes['data'].filter(s => s.isActive === 'Active');
        if (this.employeeList && this.employeeList.length > 0) {
          this.employeeList.map((employeeDropdownRes) => {
            employeeDropdownRes.value = employeeDropdownRes.id; delete employeeDropdownRes.id;
            employeeDropdownRes.label = employeeDropdownRes.name; delete employeeDropdownRes.name;
          });
          this.employeeList = this.employeeList;
        }
      }
    }, error => {
      console.log(error);
    });
  }


  getAllLeavesList() {
    this.loginEmployeeId = this.authenticationService.IsUserId();
    this.filterObj.Id = this.filterFrm.value.Id ? this.filterFrm.value.Id : this.loginEmployeeId;
    this.filterObj.FromDate = this.filterFrm.value.range ? this.datepipe.transform(this.filterFrm.value.range[0], 'yyyy-MM-dd') : null;
    this.filterObj.ToDate = this.filterFrm.value.range ? this.datepipe.transform(this.filterFrm.value.range[1], 'yyyy-MM-dd') : null;
    if (this.filterFrm.value.status === null) {
      this.filterObj['status'] = '';
    } else {
      this.filterObj['status'] = this.filterFrm.value.status ? this.filterFrm.value.status : 'Pending';
    }
    this.adminLeaveApi.getAllEmployeeSideLeaves(this.filterObj).pipe(first()).subscribe(LeavesData => {
      if (LeavesData && LeavesData['flag'] === 1) {
        this.employeeSideLeaveData = LeavesData['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  clearFilter() {
    this.filterFrm.controls['Id'].setValue('');
    this.filterFrm.controls['range'].setValue('');
    this.filterFrm.controls['status'].setValue(null);
    this.selectedLeaveStatusType = '';
    this.getAllLeavesList();
  }

  closeAddEmployeeLeavesModal() {
    this.addEmployeeLeaveModalDialog.hide();
    this.getAllLeavesList();
  }

  showConfirmForDeleteEmployeeLeaves(deleteEmployeeLeaveData: any) {
    if (deleteEmployeeLeaveData && deleteEmployeeLeaveData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteEmployeeLeaveKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteEmployeeLeaveData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteEmployeeLeaveDetails(employeeLeaveData: any) {
    this.messageService.clear('deleteEmployeeLeaveKey');
    if (employeeLeaveData && employeeLeaveData.length > 0) {
      this.deleteMultipleEmployeeLeaves(employeeLeaveData);
    } else if (employeeLeaveData && employeeLeaveData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleEmployeeLeave(employeeLeaveData, loggedInUserId);
    }
  }

  private deleteMultipleEmployeeLeaves(employeeLeaveDataForDelete: any) {
    const employeeLeaveIds = employeeLeaveDataForDelete.map((employeeLeave: { id: any; }) => employeeLeave.id);
    this.deleteMultipleParams = { Ids: employeeLeaveIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.adminLeaveApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleEmployeeLeaveRes => {
      if (deleteMultipleEmployeeLeaveRes && deleteMultipleEmployeeLeaveRes['flag'] === 1) {
        this.selectedEmployeeLeaveForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleEmployeeLeaveRes['message']
        });
        this.getAllLeavesList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleEmployeeLeaveRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleEmployeeLeave(employeeLeaveData: number, loggedInUserId: number) {
    this.messageService.clear('deleteEmployeeLeaveKey');
    this.adminLeaveApi.deleteAdminLeaveById(employeeLeaveData, loggedInUserId).pipe(first()).subscribe(deleteEmployeeLeave => {
      if (deleteEmployeeLeave && deleteEmployeeLeave['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteEmployeeLeave['message']
        });
        this.getAllLeavesList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteEmployeeLeave['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedEmployeeLeaveForCheckBox && this.selectedEmployeeLeaveForCheckBox.length > 0) {
      this.selectedEmployeeLeaveForCheckBox = [];
    }
    this.messageService.clear('deleteEmployeeLeaveKey');
  }

  showAddViewDialog(addViewLeaveObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = addViewLeaveObj === undefined ? 'Add Leave' : 'View Leave';
    this.addviewLeaveDetails = addViewLeaveObj;
  }

  closeUIModal(args?: any): void {
    this.isNeedToRenderUIModal = false;
    if (args === 1) {
      this.getAllLeavesList();
    }
  }

  customSortForEmployeeLeavesTable(event: SortEvent) {
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

  exportExcelEmployeeLeaves(employeeLeaves: any) {
    if (employeeLeaves && employeeLeaves.length > 0) {
      const adminLeaveIds = employeeLeaves.map((adminLeaveId: { id: any; }) => adminLeaveId.id);
      this.adminLeaveApi.exportToExcelAdminLeave(adminLeaveIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Leaves';
        link.click();
        this.selectedEmployeeLeaveForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }
}
