import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../services';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Filter } from '../../../../models/filter';
import { DatePipe } from '@angular/common';
import { TimeSheetApi, OrganizationApi, EmployeeApi } from '../../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService, SortEvent } from 'primeng/api';
import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { TimeSheetRequest } from '../../../../models/timesheetrequest';
import { Router } from '@angular/router';
import * as moment from 'moment';

interface SelectedEmployees {
  label: number;
  value: number;
}

@Component({
  selector: 'app-employee-timesheet-list',
  templateUrl: './employee-timesheet-list.component.html',
  styleUrls: ['./employee-timesheet-list.component.css']
})

export class EmployeeTimeSheetListComponent implements OnInit {
  @ViewChild('employeeTimesheetTable') public employeeTimesheetTable: Table;

  timeSheetList: any;
  selectedEmployeeId: any;
  filterFrm: FormGroup;
  filterObj = new Filter();
  selectedTimeSheetForCheckBox: TimeSheetRequest[];
  employeeId: number = 0; // Pass default 0 to get timesheet ngOnInit
  deleteMultipleParams: { Ids: any; loggedInUserId: any; };
  timesheetModulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  editTimesheetDetails: any;
  dynamicButtonsobj: any = {};
  employeeList: any;
  selectedEmployees: SelectedEmployees;
  UserId: any;

  constructor(
    private timeSheetApi: TimeSheetApi,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
    public router: Router,
    private employeeApi: EmployeeApi
  ) { }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.timeSheetFilterControls();
    this.getEmployeeByFullNames();
    this.getLocalStoragePermissionData();
    this.getAllTimeSheetList(this.UserId);
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

  getAllTimeSheetList(employeeId) {
    this.filterBasedOnSelection(employeeId);
  }

  private filterBasedOnSelection(employeeId: any) {
    if (employeeId === '') {
      this.selectedEmployeeId = this.UserId;
    }
    if (employeeId > 0) {
      this.selectedEmployeeId = parseInt(employeeId, 10);
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

  clearFilter() {
    this.filterFrm.controls['range'].setValue('');
    this.filterFrm.controls['Id'].setValue('');
    this.selectedEmployeeId = this.UserId;
    this.getAllTimeSheetList(this.UserId);
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
        this.getAllTimeSheetList(this.UserId);
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

  private deleteSingleTimesheet(timeSheetId: number, loggedInUserId: number) {
    this.timeSheetApi.deleteTimeSheetById(timeSheetId, loggedInUserId).pipe(first()).subscribe(deleteTimeSheetRes => {
      if (deleteTimeSheetRes && deleteTimeSheetRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteTimeSheetRes['message']
        });
        this.getAllTimeSheetList(this.UserId);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteTimeSheetRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedTimeSheetForCheckBox && this.selectedTimeSheetForCheckBox.length > 0) {
      this.selectedTimeSheetForCheckBox = [];
    }
    this.messageService.clear('deleteTimesheetKey');
  }

  showEmpTimesheetDialog(empTimesheetObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = 'Edit Timesheet';
    this.editTimesheetDetails = empTimesheetObj;
  }

  closeUIModal(arg?: any): void {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getAllTimeSheetList(this.UserId);
    }
  }

  customSortForEmployeeTimesheetTable(event: SortEvent) {
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
