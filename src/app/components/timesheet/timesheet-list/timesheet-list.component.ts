import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { TimeSheetRequest } from '../../../models/timesheetrequest';
import { SpinnerService, AuthenticationService } from '../../../services';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Filter } from '../../../models/filter';
import { DatePipe } from '@angular/common';
import { TimeSheetApi, EmployeeApi, OrganizationApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService, SortEvent } from 'primeng/api';
import * as moment from 'moment';

interface SelectedEmployees {
  label: number;
  value: number;
}

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.css']
})

export class TimeSheetListComponent implements OnInit {
  @ViewChild('timesheetTable') public timesheetTable: Table;

  timeSheetList: any;
  employeeNames: any;
  selectedEmployeeId: number = 0;
  filterFrm: FormGroup;
  filterObj = new Filter();
  employeeId: number = 0; // Pass default 0 to get timesheet ngOnInit
  selectedTimeSheetForCheckBox: TimeSheetRequest[];
  deleteMultipleParams: { Ids: any; loggedInUserId: any; };
  selectedEmployees: SelectedEmployees;
  timesheetModulePermission: any;
  roleId: any;
  employeeList: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  timesheetListObj: any;
  isNeedToRenderAdminData: boolean = false;
  isNeedToRenderEmployeeData: boolean = false;
  dynamicButtonsobj: any = {};

  constructor(
    private timeSheetApi: TimeSheetApi,
    private employeeApi: EmployeeApi,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private spinnerService: SpinnerService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.roleBasedDataBinding();
    this.getLocalStoragePermissionData();
    this.timeSheetFilterControls();
    this.getEmployeeByFullNames();
    this.getAllTimeSheetList(this.employeeId);
  }

  private roleBasedDataBinding() {
    if (this.authenticationService.isAdmin()) {
      this.isNeedToRenderAdminData = true;
    } else {
      this.isNeedToRenderEmployeeData = true;
    }
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.timesheetModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.TIMESHEETS_SCREEN)[0];
        if (this.timesheetModulePermission && this.timesheetModulePermission !== undefined) {
          this.timesheetModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  private timeSheetFilterControls() {
    this.filterFrm = this.formBuilder.group({
      Id: [''],
      range: new FormControl([
        new Date(),
        new Date()
      ])
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

  getAllTimeSheetList(employeeId) {
    this.filterBasedOnSelection(employeeId);
  }

  private filterBasedOnSelection(employeeId: any) {
    if (employeeId > 0) {
      this.selectedEmployeeId = parseInt(employeeId, 10);
    }
    if (employeeId === '') {
      this.selectedEmployeeId = 0;
    }
    this.filterObj = this.filterFrm.value;
    if (this.filterObj.Id) {
      this.filterObj.Id = Number(this.filterObj.Id);
    } else {
      this.filterObj.Id = this.selectedEmployeeId ? Number(this.selectedEmployeeId) : Number(this.employeeId);
    }
    this.filterObj.FromDate = (this.filterFrm.value.range && this.filterFrm.value.range.length !== undefined) ?
      this.datepipe.transform(this.filterFrm.value.range[0], 'yyyy-MM-dd') : null;
    this.filterObj.ToDate = (this.filterFrm.value.range && this.filterFrm.value.range.length !== undefined) ?
      this.datepipe.transform(this.filterFrm.value.range[1], 'yyyy-MM-dd') : null;
    this.timeSheetApi.getTimeSheetList(this.filterObj).pipe(first()).subscribe(timeSheetRes => {
      if (timeSheetRes && timeSheetRes['flag'] === 1) {
        this.timeSheetList = timeSheetRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  clearFilter() {
    this.filterFrm.controls['Id'].setValue('');
    this.filterFrm.controls['range'].setValue('');
    this.selectedEmployeeId = 0;
    this.selectedTimeSheetForCheckBox = [];
    this.getAllTimeSheetList(0);
  }

  exportExcelTimesheets(timesheetArgs: any) {
    if (timesheetArgs && timesheetArgs.length > 0) {
      const timesheetIds = timesheetArgs.map((timesheetId: { id: any; }) => timesheetId.id);
      this.timeSheetApi.exportToExcelTimesheet(timesheetIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Timesheets';
        link.click();
        this.selectedTimeSheetForCheckBox = [];
      }, error => {
        this.spinnerService.hideSpinner();
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteTimesheets(deleteTimeSheetdata: any) {
    if (deleteTimeSheetdata && deleteTimeSheetdata.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteTimesheetKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteTimeSheetdata
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteTimeSheetDetails(timeSheetData: any) {
    this.messageService.clear('deleteTimesheetKey');
    if (timeSheetData && timeSheetData.length > 0) {
      this.deleteMultipleTimesheets(timeSheetData);
    } else if (timeSheetData && timeSheetData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleTimesheet(timeSheetData, loggedInUserId);
    }
  }

  private deleteMultipleTimesheets(timesheetDataForDelete: any) {
    const timeshetIds = timesheetDataForDelete.map((timeshetId: { id: any; }) => timeshetId.id);
    this.deleteMultipleParams = { Ids: timeshetIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.timeSheetApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedTimeSheetForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllTimeSheetList(0);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: res['message']
        });
      }
    }, error => {
      this.spinnerService.hideSpinner();
      console.log(error);
    });
  }

  private deleteSingleTimesheet(timeSheetId: number, loggedInUserId: number) {
    this.timeSheetApi.deleteTimeSheetById(timeSheetId, loggedInUserId).pipe(first()).subscribe(deleteTimeSheetRes => {
      if (deleteTimeSheetRes && deleteTimeSheetRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteTimeSheetRes['message']
        });
        this.getAllTimeSheetList(0);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteTimeSheetRes['message']
        });
      }
    }, error => {
      this.spinnerService.hideSpinner();
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedTimeSheetForCheckBox && this.selectedTimeSheetForCheckBox.length > 0) {
      this.selectedTimeSheetForCheckBox = [];
    }
    this.messageService.clear('deleteTimesheetKey');
  }

  showAdminTimesheetDialog(timesheetObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = timesheetObj === undefined ? 'Add Timesheet' : 'Edit Timesheet';
    this.timesheetListObj = timesheetObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getAllTimeSheetList(0);
    }
  }

  customSortForTimeSheetTable(event: SortEvent) {
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
