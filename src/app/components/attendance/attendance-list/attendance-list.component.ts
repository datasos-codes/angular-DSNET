import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AttendanceRequest } from '../../../models/attendancerequest';
import { AuthenticationService } from '../../../services';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Filter } from '../../../models/filter';
import { DatePipe } from '@angular/common';
import { AttendanceApi, EmployeeApi, OrganizationApi } from '../../../shared/api';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import * as moment from 'moment';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  @ViewChild('attendancetable') attendancetable: Table;

  attendanceData: any = [];
  selectedAttendanceForCheckBox: AttendanceRequest[];
  deleteMultipleParams: any;
  filterFrm: FormGroup;
  filterObj = new Filter();
  employeeData: any;
  employeeId: number = 0;
  attendanceModulePermission: any;
  roleId: any;
  employeeList: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  AttendanceListObj: any;
  isNeedToRenderAdminRole = false;
  isNeedToRenderOtherRole = false;
  dynamicButtonsobj: any = {};

  constructor(
    private attendanceApi: AttendanceApi,
    private employeeApi: EmployeeApi,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi
  ) { }

  ngOnInit(): void {
    this.roleBasedDataBinding();
    this.AttendanceFilterControls();
    this.getAllEmployeeByName();
    this.geAllAttendanceData();
    this.getLocalStoragePermissionData();
  }

  private roleBasedDataBinding() {
    if (this.authenticationService.isAdmin()) {
      this.isNeedToRenderAdminRole = true;
    } else {
      this.isNeedToRenderOtherRole = true;
    }
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.attendanceModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.ATTENDANCES_SCREEN)[0];
        if (this.attendanceModulePermission && this.attendanceModulePermission !== undefined) {
          this.attendanceModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  private AttendanceFilterControls() {
    this.filterFrm = this.formBuilder.group({
      Id: [''],
      range: new FormControl([
        new Date(),
        new Date()
      ])
    });
  }

  getAllEmployeeByName(): void {
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

  geAllAttendanceData() {
    this.filterObj = this.filterFrm.value;
    this.filterObj.Id = this.filterObj.Id ? this.filterObj.Id : 0;
    this.filterObj.FromDate = (this.filterFrm.value.range && this.filterFrm.value.range.length !== undefined) ?
      this.datepipe.transform(this.filterFrm.value.range[0], 'yyyy-MM-dd') : null;
    this.filterObj.ToDate = (this.filterFrm.value.range && this.filterFrm.value.range.length !== undefined) ?
      this.datepipe.transform(this.filterFrm.value.range[1], 'yyyy-MM-dd') : null;
    delete this.filterObj.range;
    this.attendanceApi.geAllAttendanceList(this.filterObj).pipe(first()).subscribe(attendanceListRes => {
      if (attendanceListRes && attendanceListRes['flag'] === 1) {
        this.attendanceData = attendanceListRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  clearFilter() {
    this.filterFrm.controls['Id'].setValue('');
    this.filterFrm.controls['range'].setValue('');
    this.geAllAttendanceData();
  }

  exportExcelAttendance(attendanceArgs: any) {
    if (attendanceArgs && attendanceArgs.length > 0) {
      const attendanceIds = attendanceArgs.map((attendanceId: { id: any; }) => attendanceId.id);
      this.attendanceApi.exportToExcelAttendance(attendanceIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Attendance';
        link.click();
        this.selectedAttendanceForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteAttendance(deleteAttendanceData: any) {
    if (deleteAttendanceData && deleteAttendanceData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteAttendanceKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteAttendanceData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteAttendanceDetails(attendanceData: any) {
    this.messageService.clear('deleteAttendanceKey');
    if (attendanceData && attendanceData.length > 0) {
      this.deleteMultipleAttendance(attendanceData);
    } else if (attendanceData && attendanceData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleAttendance(attendanceData, loggedInUserId);
    }
  }

  private deleteMultipleAttendance(attendanceDataForDelete: any) {
    const attendanceIds = attendanceDataForDelete.map((attendanceId: { id: any; }) => attendanceId.id);
    this.deleteMultipleParams = { Ids: attendanceIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.attendanceApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedAttendanceForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.geAllAttendanceData();
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

  private deleteSingleAttendance(attendanceData: any, loggedInUserId: any) {
    this.attendanceApi.deleteAttendanceById(attendanceData, loggedInUserId).pipe(first()).subscribe(deleteAttendanceRes => {
      if (deleteAttendanceRes && deleteAttendanceRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteAttendanceRes['message']
        });
        this.geAllAttendanceData();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteAttendanceRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedAttendanceForCheckBox && this.selectedAttendanceForCheckBox.length > 0) {
      this.selectedAttendanceForCheckBox = [];
    }
    this.messageService.clear('deleteAttendanceKey');
  }

  showAttendancesDialog(AttendanceObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = AttendanceObj === undefined ? 'Add Attendance' : 'Edit Attendance';
    this.AttendanceListObj = AttendanceObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.geAllAttendanceData();
    }
  }

  customSortForAttendanceTable(event: SortEvent) {
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
