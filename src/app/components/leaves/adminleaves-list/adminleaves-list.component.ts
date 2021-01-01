import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminLeavesRequest } from '../../../models/adminleavesrequest';
import { AuthenticationService } from '../../../services';
import { first } from 'rxjs/operators';
import { AdminLeaveApi, EmployeeApi, OrganizationApi } from '../../../shared/api';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';
import * as moment from 'moment';

@Component({
  selector: 'app-adminleaves-list',
  templateUrl: './adminleaves-list.component.html',
  styleUrls: ['./adminleaves-list.component.css']
})
export class AdminleavesListComponent implements OnInit {
  @ViewChild('adminleavestable') adminleavestable: Table;

  adminSideLeaveData: any = [];
  selectedAdmimLeaveForCheckBox: AdminLeavesRequest[];
  deleteMultipleParams: any;
  employeeId: number = 0;
  filterFrm: FormGroup;
  employeeData: any;
  selectedEmployeeId: any;
  filterObj: any;
  leaveModulePermission: any;
  roleId: any;
  employeeList: any;
  LeaveStatusTypes: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;
  selectedLeaveStatusType: any;
  isNeedToRenderUIModal: boolean;
  displayHeader: string;
  adminLeaveListObj: any;
  isNeedToRenderAdminRole: boolean = false;
  isNeedToRenderOtherRole: boolean = false;
  loading: boolean;
  dynamicButtonsobj: any = {};
  UserId: number;

  constructor(
    private adminLeaveApi: AdminLeaveApi,
    public authenticationService: AuthenticationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    public datepipe: DatePipe,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.roleBasedDataBinding();
    this.leavesFilterControls();
    this.getDropDownNamesByTypes();
    this.getAllEmployeeByName();
    this.getLocalStoragePermissionData();
    this.getAllAdminLeavesList();
  }

  private roleBasedDataBinding() {
    if (this.authenticationService.isAdmin() || this.authenticationService.isHR()) {
      this.isNeedToRenderAdminRole = true;
    } else {
      this.isNeedToRenderOtherRole = true;
    }
  }

  private leavesFilterControls() {
    this.filterFrm = this.formBuilder.group({
      Id: [''],
      range: [null],
      status: ['']
    });
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
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getAllEmployeeByName(): void {
    this.employeeApi.getAllUsersByNames().pipe(first()).subscribe(employeeRes => {
      if (employeeRes && employeeRes['flag'] === 1) {
        this.employeeList = employeeRes['data'].filter(s => s.isActive === 'Active');
        if (this.employeeList && this.employeeList.length > 0) {
          this.employeeList.map((employeeDropdownRes) => {
            employeeDropdownRes.value = employeeDropdownRes.id;
            employeeDropdownRes.label = employeeDropdownRes.name;
          });
          this.employeeList = this.employeeList;
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

  getAllAdminLeavesList() {
    this.filterObj = this.filterFrm.value;
    if (this.authenticationService.isHR()) { // if login user is HR
      this.filterObj.Id = this.filterObj.Id ? Number(this.filterObj.Id) : this.UserId;
    } else {
      this.filterObj.Id = this.filterObj.Id ? this.filterObj.Id : 0;
    }
    this.filterObj.FromDate = this.filterFrm.value.range ? this.datepipe.transform(this.filterFrm.value.range[0], 'yyyy-MM-dd') : null;
    this.filterObj.ToDate = this.filterFrm.value.range ? this.datepipe.transform(this.filterFrm.value.range[1], 'yyyy-MM-dd') : null;
    if (this.filterFrm.value.status === null) {
      this.filterObj['status'] = '';
    } else {
      this.filterObj['status'] = this.filterFrm.value.status ? this.filterFrm.value.status : 'Pending';
    }
    this.adminLeaveApi.getAllAdminSideLeaves(this.filterObj).pipe(first()).subscribe(adminLeavesData => {
      if (adminLeavesData && adminLeavesData['flag'] === 1) {
        this.adminSideLeaveData = adminLeavesData['data'];
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
    this.selectedEmployeeId = 0;
    this.getAllAdminLeavesList();
  }

  exportExcelAdminLeave(adminLeaveArgs: any) {
    if (adminLeaveArgs && adminLeaveArgs.length > 0) {
      const adminLeaveIds = adminLeaveArgs.map((adminLeaveId: { id: any; }) => adminLeaveId.id);
      this.adminLeaveApi.exportToExcelAdminLeave(adminLeaveIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'AdminLeaves';
        link.click();
        this.selectedAdmimLeaveForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteAdminLeaves(deleteAdminLeaveData: any) {
    if (deleteAdminLeaveData && deleteAdminLeaveData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteAdminLeaveKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteAdminLeaveData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteadminLeaveDetails(adminLeaveData: any) {
    this.messageService.clear('deleteAdminLeaveKey');
    if (adminLeaveData && adminLeaveData.length > 0) {
      this.deleteMultipleAdminLeaves(adminLeaveData);
    } else if (adminLeaveData && adminLeaveData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleAdminLeave(adminLeaveData, loggedInUserId);
    }
  }

  private deleteMultipleAdminLeaves(adminLeaveDataForDelete: any) {
    const adminLeaveIds = adminLeaveDataForDelete.map((adminLeave: { id: any; }) => adminLeave.id);
    this.deleteMultipleParams = { Ids: adminLeaveIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.adminLeaveApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleAdminLeaveRes => {
      if (deleteMultipleAdminLeaveRes && deleteMultipleAdminLeaveRes['flag'] === 1) {
        this.selectedAdmimLeaveForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleAdminLeaveRes['message']
        });
        this.getAllAdminLeavesList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleAdminLeaveRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleAdminLeave(adminLeaveData: number, loggedInUserId: number) {
    this.messageService.clear('deleteAdminLeaveKey');
    this.adminLeaveApi.deleteAdminLeaveById(adminLeaveData, loggedInUserId).pipe(first()).subscribe(deleteAdminLeave => {
      if (deleteAdminLeave && deleteAdminLeave['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteAdminLeave['message']
        });
        this.getAllAdminLeavesList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteAdminLeave['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedAdmimLeaveForCheckBox && this.selectedAdmimLeaveForCheckBox.length > 0) {
      this.selectedAdmimLeaveForCheckBox = [];
    }
    this.messageService.clear('deleteAdminLeaveKey');
  }

  showAdminLeaveDialog(adminLeaveObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = adminLeaveObj === undefined ? 'Add Leave' : 'Edit Leave';
    this.adminLeaveListObj = adminLeaveObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getAllAdminLeavesList();
    }
  }

  customSortForAdmimLeaveTable(event: SortEvent) {
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
