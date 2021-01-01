import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../services';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Filter } from '../../../../models/filter';
import { DatePipe } from '@angular/common';
import { AttendanceApi, OrganizationApi } from '../../../../shared/api';
import { Table } from 'primeng/table/table';
import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { SortEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-attendance-list',
  templateUrl: './employee-attendance-list.component.html',
  styleUrls: ['./employee-attendance-list.component.css']
})
export class EmployeeAttendanceListComponent implements OnInit {
  @ViewChild('attendancetable') attendancetable: Table;

  attendanceData: any = [];
  filterFrm: FormGroup;
  filterObj = new Filter();
  attendanceModulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  viewAttendanceDetails: any;
  dynamicButtonsobj: any = {};

  constructor(
    private attendanceApi: AttendanceApi,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private organizationApi: OrganizationApi
  ) { }

  ngOnInit(): void {
    this.getLocalStoragePermissionData();
    this.AttendanceFilterControls();
    this.geAllAttendanceList();
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
      range: new FormControl([
        new Date(),
        new Date()
      ])
    });
  }

  geAllAttendanceList() {
    this.filterObj.Id = this.authenticationService.IsUserId();
    this.filterObj.FromDate = (this.filterFrm.value.range && this.filterFrm.value.range.length !== undefined) ?
      this.datepipe.transform(this.filterFrm.value.range[0], 'yyyy-MM-dd') : null;
    this.filterObj.ToDate = (this.filterFrm.value.range && this.filterFrm.value.range.length !== undefined) ?
      this.datepipe.transform(this.filterFrm.value.range[1], 'yyyy-MM-dd') : null;
    this.attendanceApi.geAllAttendanceList(this.filterObj).pipe(first()).subscribe(attendanceListRes => {
      if (attendanceListRes && attendanceListRes['flag'] === 1) {
        this.attendanceData = attendanceListRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  clearFilter() {
    this.filterFrm.controls['range'].setValue('');
    this.geAllAttendanceList();
  }

  showViewEployeeAttendanceDialog(empAttendanceobj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = 'View Attendance';
    this.viewAttendanceDetails = empAttendanceobj;
  }

  closeUIModal(): void {
    this.isNeedToRenderUIModal = false;
  }

  customSortForEmployeeAttendancesTable(event: SortEvent) {
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
