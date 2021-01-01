import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminLeavesRequest } from '../../../models/adminleavesrequest';
import { NotificationService, AuthenticationService, CustomvalidationService } from '../../../services';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { AdminLeaveApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditadminleave',
  templateUrl: './addeditadminleave.component.html',
  styleUrls: ['./addeditadminleave.component.css']
})
export class AddeditadminleaveComponent implements OnInit {
  @Input() adminLeaveListObj: any;
  @Output() closeAdminLeaveUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditAdminLeavesFrm: FormGroup;
  submitted = false;
  adminLeavesObj: AdminLeavesRequest;
  employeeData: any;
  isNeedToRenderLeaveTotal: boolean = false;
  loading = false;
  UserId: any;
  isNeedToRenderLeaveFor: boolean = false;
  LeaveForTypes: any;
  selectedLeaveForType: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;
  LeaveTypes: any;
  selectedLeaveType: any;
  LeaveStatusTypes: any;
  selectedStatusType: any;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private adminLeaveApi: AdminLeaveApi,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.adminLeavesObj = new AdminLeavesRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.adminLeaveControls();
    this.getEmployeeByNames();
    this.editAdminLeaveData();
  }

  private editAdminLeaveData() {
    if (this.adminLeaveListObj !== undefined && this.adminLeaveListObj.id > 0) {
      const leaveDateArr = [];
      leaveDateArr.push(new Date(this.adminLeaveListObj.leaveStartDate));
      leaveDateArr.push(new Date(this.adminLeaveListObj.leaveEndDate));
      this.adminLeaveListObj.range = leaveDateArr;
      this.adminLeavesObj = this.adminLeaveListObj;
    }
  }

  getDropDownNamesByTypes() {
    this.employeeApi.getDropDownNamesByType().subscribe(dropdownNameRes => {
      if (dropdownNameRes && dropdownNameRes['flag'] === 1) {
        if (dropdownNameRes['data'] && dropdownNameRes['data'].length > 0) {
          dropdownNameRes['data'].map((data) => {
            data.label = data.displayName;
            data.value = data.displayValue;
          });
          this.LeaveForTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.LEAVEFORTYPE);
          this.selectedLeaveForType = this.LeaveForTypes[0].value;
          this.LeaveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.LEAVETYPE);
          this.selectedLeaveType = this.LeaveTypes[0].value;
          this.LeaveStatusTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.LEAVESTATUSTYPE);
          this.selectedStatusType = this.LeaveStatusTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  get f() { return this.addEditAdminLeavesFrm.controls; }

  private adminLeaveControls() {
    this.addEditAdminLeavesFrm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      range: [null, Validators.required],
      leaveType: ['', Validators.required],
      reason: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      remark: ['', this.customvalidationService.cannotContainSpace],
      status: ['', Validators.required],
      numberOfDays: [''],
      leaveFor: [''],
    });
  }

  getEmployeeByNames(): void {
    this.employeeApi.getAllUsersByNames(true).pipe(first()).subscribe(employeeRes => {
      if (employeeRes && employeeRes['flag'] === 1) {
        this.employeeData = employeeRes['data'].filter(s => s.isActive === this.selectedIsActiveType);
        if (this.employeeData && this.employeeData.length > 0) {
          this.employeeData.map((employeeDropdownRes) => {
            employeeDropdownRes.value = employeeDropdownRes.id; delete employeeDropdownRes.id;
            employeeDropdownRes.label = employeeDropdownRes.name; delete employeeDropdownRes.name;
          });
          this.employeeData = this.employeeData;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitAddEditAdminLeavesFrm() {
    this.submitted = true;
    if (this.addEditAdminLeavesFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.adminLeavesObj = this.addEditAdminLeavesFrm.value;
      this.adminLeavesObj.employeeId = parseInt(this.addEditAdminLeavesFrm.value.employeeId, 10);
      this.adminLeavesObj.leaveStartDate = this.datepipe.transform(this.adminLeavesObj.range[0], 'yyyy-MM-dd');
      this.adminLeavesObj.leaveEndDate = this.datepipe.transform(this.adminLeavesObj.range[1], 'yyyy-MM-dd');
      if (this.adminLeaveListObj !== undefined && this.adminLeaveListObj.id > 0) {
        this.adminLeavesObj.id = this.adminLeaveListObj.id;
        this.adminLeavesObj.modifiedBy = this.UserId;
      } else {
        this.adminLeavesObj.createdBy = this.UserId;
      }
      this.adminLeavesObj.leaveFor = (this.isNeedToRenderLeaveFor === false ? '' : this.adminLeavesObj.leaveFor);
      this.addeditAdminLeave(this.adminLeavesObj);
    }
  }

  private addeditAdminLeave(adminLeavesData: any): void {
    this.adminLeaveApi.addEditAdminLeavesData(adminLeavesData).subscribe(adminLeaveRes => {
      if (adminLeaveRes && adminLeaveRes['flag'] === 1) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: adminLeaveRes['message']
        });
        this.closeAdminLeaveUIModalEvent.emit(adminLeaveRes['flag']);
        this.isNeedToRenderLeaveTotal = false;
        this.notificationService.refreshNotification.next(true);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: adminLeaveRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  countTotalNumberOfLeaves(arg: any) {
    if (arg && arg.length > 0) {
      const sDate = moment(arg[0]);
      const eDate = moment(arg[1]);
      this.adminLeavesObj.numberOfDays = Math.abs(sDate.diff(eDate, 'days')) + 1;
      this.isNeedToRenderLeaveTotal = true;
      if (this.adminLeavesObj.numberOfDays === 1) {
        this.isNeedToRenderLeaveFor = true;
      } else {
        this.isNeedToRenderLeaveFor = false;
      }
    }
  }
}
