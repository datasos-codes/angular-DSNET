import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../services';
import { first } from 'rxjs/operators';
import { HolidaysRequest } from '../../../models/holidaysrequest';
import { HolidaysApi, OrganizationApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService, SortEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-holidays-list',
  templateUrl: './holidays-list.component.html',
  styleUrls: ['./holidays-list.component.css']
})
export class HolidaysListComponent implements OnInit {
  @ViewChild('holidayTable') holidayTable: Table;

  holidayData: any = [];
  holidayTitles: any;
  selectedHolidayForCheckBox: HolidaysRequest[];
  deleteMultipleParams: any;
  holidayModulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  holidayListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private holidaysApi: HolidaysApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.getAllHolidayList();
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.holidayModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.HOLIDAYS_SCREEN)[0];
        if (this.holidayModulePermission && this.holidayModulePermission !== undefined) {
          this.holidayModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getAllHolidayList() {
    const currentYear = (new Date()).getFullYear();
    this.holidaysApi.getAllHolidayListByYear(currentYear).pipe(first()).subscribe(holidayRes => {
      if (holidayRes && holidayRes['flag'] === 1) {
        this.holidayData = holidayRes['data'].filter(s => s.isActive === 'Active');
        this.holidayTitles = this.holidayData.map(t => t.title);
      }
    }, error => {
      console.log(error);
    });
  }

  exportExcelHolidays(holidayArgs: any) {
    if (holidayArgs && holidayArgs.length > 0) {
      const holidayIds = holidayArgs.map((holidayId: { id: any; }) => holidayId.id);
      this.holidaysApi.exportToExcelHoliday(holidayIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Holidays';
        link.click();
        this.selectedHolidayForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteHolidays(deleteHolidayData: any) {
    if (deleteHolidayData && deleteHolidayData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteHolidayKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteHolidayData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteHolidayDetails(holidayData: any) {
    this.messageService.clear('deleteHolidayKey');
    if (holidayData && holidayData.length > 0) {
      this.deleteMultipleHolidays(holidayData);
    } else if (holidayData && holidayData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleHoliday(holidayData, loggedInUserId);
    }
  }

  private deleteMultipleHolidays(holidayDataForDelete: any) {
    const holidayIds = holidayDataForDelete.map((holidayId: { id: any; }) => holidayId.id);
    this.deleteMultipleParams = { Ids: holidayIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.holidaysApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedHolidayForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllHolidayList();
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

  private deleteSingleHoliday(holidayData: number, loggedInUserId: number) {
    this.messageService.clear('deleteHolidayKey');
    this.holidaysApi.deleteHolidayById(holidayData, loggedInUserId).pipe(first()).subscribe(deleteHolidayRes => {
      if (deleteHolidayRes && deleteHolidayRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteHolidayRes['message']
        });
        this.getAllHolidayList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteHolidayRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedHolidayForCheckBox && this.selectedHolidayForCheckBox.length > 0) {
      this.selectedHolidayForCheckBox = [];
    }
    this.messageService.clear('deleteHolidayKey');
  }

  showHolidayDialog(holidayObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = holidayObj === undefined ? 'Add Holiday' : 'Edit Holiday';
    this.holidayListObj = holidayObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getAllHolidayList();
    }
  }

  customSortForEmployeeHolidayTable(event: SortEvent) {
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
